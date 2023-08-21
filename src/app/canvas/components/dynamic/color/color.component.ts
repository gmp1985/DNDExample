import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Renderer2, SimpleChanges } from '@angular/core';
import { HsvColor } from './HsvColor';
import { ColorService } from 'src/app/canvas/Services/color.service';
import { TemplateService } from 'src/app/canvas/services/template.service';

@Component({
  selector: 'ark-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {
    @ViewChild('pickerContainer')
    pickerContainer: ElementRef;
    @ViewChild('wheelContainer')
    wheelContainer: ElementRef;
    @ViewChild('canvas')
    wheelCanvas: ElementRef;
    @ViewChild('marker')
    public gradientMarker: ElementRef;
    @ViewChild('picker')
    public gradientPicker: ElementRef;


    @Input()
    height = 250;

    @Input() colorCode;
    @Input() defaultColor;

    @Input()
    selType: string;
    @Output()
    public colorCodeChange = new EventEmitter<string>();
    public rgbText: string;
    public hexText: string;
    public hsvColor: HsvColor = {hue: Math.PI, saturation: 0, value: 1};

    public wheelRadius: number;
    public isWheelDragging = false;
    public gradientScaleSize: number;
    public isGradientDragging = false;
    public context: CanvasRenderingContext2D;

  constructor(private colorService: ColorService, private renderer: Renderer2, private templateService: TemplateService) { }

  ngOnInit() {
    //this.colorCode = this.templateService.selectedElement.style.backgroundColor;    
    if(this.templateService.selectedElement.style.backgroundColor != ''){
        this.colorCode = this.templateService.selectedElement.style.backgroundColor;
        let colorCode = this.colorCode.split(/(\d+)/);
        this.colorCode = this.colorService.rgb2hex({red: +colorCode[1], green: +colorCode[3], blue: +colorCode[5]});
    }       

    /*background-image: linear-gradient(#80d310, #80d310),
    linear-gradient(123deg, #80d310 25%, #ffffff 25%, #ffffff 50%, #80d310 50%, #80d310 75%, #ffffff 75%, #ffffff 100%);*/
  }

  ngAfterViewInit(): void {
      const canvasElement: HTMLCanvasElement = this.wheelCanvas.nativeElement;
      this.context = canvasElement.getContext('2d');
      this.gradientScaleSize = this.height;
      this.renderer.setStyle(this.pickerContainer.nativeElement,
          'width',
          this.height + 'px');
      this.initColorWheel();
      this.onInputChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.colorCode && changes.colorCode.currentValue !== this.hexText) {
          this.onInputChanged();
      }
  }

  public initColorWheel() {
      this.wheelRadius = this.height / 2;
      this.context.canvas.height = this.height;
      this.context.canvas.width = this.height;
  }

  public onColorChanged() {
      this.colorCodeChange.emit(
          this.colorService.rgb2hex(
              this.colorService.hsv2rgb(this.hsvColor)
          )
      );

      if(this.selType == 'background-color'){
        this.renderer.setStyle(this.templateService.selectedElement,
            'background-color',
            this.colorCode);

          /*background-image: linear-gradient(#80d310, #80d310),
        linear-gradient(123deg, #80d310 25%, #ffffff 25%, #ffffff 50%, #80d310 50%, #80d310 75%, #ffffff 75%, #ffffff 100%);*/
          this.renderer.setStyle(this.templateService.selectedElement,
            'background-image',
            'linear-gradient('+this.colorCode+', '+this.colorCode+'), linear-gradient(123deg, '+this.colorCode+' 25%, #ffffff 25%, #ffffff 50%, '+this.colorCode+' 50%, '+this.colorCode+' 75%, #ffffff 75%, #ffffff 100%)');
      }
      else{
        this.renderer.setStyle(this.templateService.selectedElement,
            'color',
            this.colorCode);
      }
  }

  public onInputChanged() {
      if (!this.colorService.isValidHexCode(this.colorCode)) {
          return;
      }
      const {red, green, blue} = this.colorService.hex2rgb(this.colorCode);
      this.hsvColor = this.colorService.rgb2hsv({red, green, blue});
      this.rgbText = `rgb(${red},${green},${blue})`;
      this.hexText = this.colorCode;
      this.renderWheel();
      this.setGradientMarkerPosition(this.hsvColor.value);
  }

  public onWheelClick(mouseX: number, mouseY: number) {
      const [x, y] = [mouseX - this.wheelRadius, mouseY - this.wheelRadius];
      this.onWheelColorSelected(x, y);
  }

  public onWheelDrag(mouseX: number, mouseY: number) {
      if (this.isWheelDragging) {
          const [x, y] = [mouseX - this.wheelRadius, mouseY - this.wheelRadius];
          this.onWheelColorSelected(x, y);
      }
  }

  public onWheelColorSelected(x: number, y: number): void {
      const [r, phi] = this.xy2polar(x, y);
      this.hsvColor.hue = phi;
      this.hsvColor.saturation = r <= this.wheelRadius ? r / this.wheelRadius : 1;
      this.renderWheel();
      this.updateTexts();
      this.onColorChanged();
  }

  public renderWheel() {
      if (!this.context) {
          return;
      }
      const image = this.createWheelImage();
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.context.putImageData(image, 0, 0);
      this.context.closePath();

      this.drawMaskingCircle(this.context);

      const [markerX, markerY] = this.hueSaturation2WheelXy(this.hsvColor.hue, this.hsvColor.saturation);
      this.context.beginPath();
      this.context.arc(markerX, markerY, 4, 0, 2 * Math.PI, false);
      this.context.fillStyle = '#ffffff';
      this.context.fill();
      this.context.lineWidth = 2;
      this.context.strokeStyle = '#000000';
      this.context.stroke();
      this.context.closePath();
  }

  public onGradientChange(x: number): void {
      this.hsvColor.value = Math.max(0, x) / (this.gradientScaleSize - 1);
      this.setGradientMarkerPosition(this.hsvColor.value);
      this.renderWheel();
      this.updateTexts();
      this.onColorChanged();
  }

  public updateTexts() {
      const {red, green, blue} = this.colorService.hsv2rgb(this.hsvColor);
      this.rgbText = `rgb(${red},${green},${blue})`;
      this.hexText = this.colorService.rgb2hex({red, green, blue});
  }

  public setGradientMarkerPosition(value: number) {
      this.renderer.setStyle(this.gradientMarker.nativeElement,
          'left',
          this.getPositionFromValue(value) + 'px');
  }

  public getPositionFromValue(value: number): number {
      return (value * this.gradientScaleSize - 1);
  }

  public drawMaskingCircle(context: CanvasRenderingContext2D): void {
      const previousCompositeOperation = context.globalCompositeOperation;
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(this.context.canvas.width / 2, this.context.canvas.height / 2, this.wheelRadius + 1, 0, 2 * Math.PI, false);
      context.lineWidth = 4;
      context.strokeStyle = 'rgba(0,0,0,1)';
      context.stroke();
      context.closePath();
      context.globalCompositeOperation = previousCompositeOperation;
  }

  /**
   * Creates an image with a color wheel
   */
  public createWheelImage(): ImageData {
      const image = this.context.createImageData(2 * this.wheelRadius, 2 * this.wheelRadius);
      const data = image.data;
      const alpha = 255;
      for (let x = -this.wheelRadius; x < this.wheelRadius; x++) {
          for (let y = -this.wheelRadius; y < this.wheelRadius; y++) {
              const [r, phi] = this.xy2polar(x, y);

              if (r > this.wheelRadius) {
                  // skip all (x,y) coordinates that are outside of the circle
                  continue;
              }

              // Figure out the starting index of this pixel in the image data array.
              const rowLength = 2 * this.wheelRadius;
              const adjustedX = x + this.wheelRadius; // convert x from [-radius, radius] to [0, 2*radius]
              const adjustedY = y + this.wheelRadius; // convert y from [-radius, radius] to [0, 2*radius]
              const pixelWidth = 4; // each pixel consist of 4 slots in the data array (r,g,b,alpha)
              const index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

              const saturation = r / this.wheelRadius;
              const {red, green, blue} = this.colorService.hsv2rgb({
                  hue: phi,
                  saturation,
                  value: this.hsvColor.value
              });

              data[index] = red;
              data[index + 1] = green;
              data[index + 2] = blue;
              data[index + 3] = alpha;

          }

      }
      return image;
  }

  /**
   * Converts Hue and Saturation to x,y coordinates
   *
   * @param hue
   * @param saturation
   */
  hueSaturation2WheelXy(hue: number, saturation: number): [number, number] {
      const x = this.wheelRadius * saturation * Math.cos(hue) + this.wheelRadius;
      const y = this.wheelRadius * saturation * Math.sin(hue) + this.wheelRadius;

      return [Math.round(x), Math.round(y)];
  }

  /**
   * Returns the polar coordinate representation of the given x,y coordinates
   * @param x
   * @param y
   *
   * return [r, phi]
   */
  public xy2polar(x: number, y: number): [number, number] {
      const r = Math.sqrt(x * x + y * y);
      const phi = Math.atan2(y, x);
      return [r, phi];
  }

  public onRgbChange(rgbString: string) {
      const rgb = this.colorService.parseRgbString(rgbString);
      if (!rgb) {
          return;
      }
      this.hsvColor = this.colorService.rgb2hsv(rgb);
      this.colorCode = this.colorService.rgb2hex(rgb);
      this.onColorChanged();
      this.onInputChanged();
  }

  public onHexChange(hexColor: string) {
      this.colorCode = hexColor;
      this.colorCodeChange.emit(hexColor);
      this.onColorChanged();
      this.onInputChanged();
  }
}
