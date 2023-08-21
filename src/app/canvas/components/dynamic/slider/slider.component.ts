import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges, Renderer2 } from '@angular/core';
import { SliderConfig } from './SliderConfig';

@Component({
  selector: 'ark-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  @ViewChild('handle')
  handle: ElementRef<HTMLDivElement>;
  @ViewChild('slider')
  slider: ElementRef<HTMLDivElement>;

  @Input()
  config: SliderConfig;
  @Input()
  value: number;
  @Output()
  valueChange = new EventEmitter<number>();

  isHandleDragging: boolean = false;
  sliderWidth: number;
  
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.sanitizeConfig();
    if (this.value === undefined || !this.isValueWithinRange(this.value)) {
        this.value = this.config.minValue;
    }
  }

  ngAfterViewInit(): void {
    this.sliderWidth = this.slider.nativeElement.offsetWidth;
    this.moveHandle(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.value) {
          if (!this.isValueWithinRange(changes.value.currentValue)) {
              this.value = this.config.minValue;
              this.valueChange.emit(this.value);
          }
          this.moveHandle(this.value);
      }
  }

  jumpPosition(position: number) {
      this.value = this.snapToStepCount(this.scaleToValue(position));
      this.moveHandle(this.value);
      this.valueChange.emit(this.value);
  }

  onWheelDrag(value: number) {
      if (!this.isHandleDragging) {
          return;
      }
      this.jumpPosition(value);
  }

  /**
   * Snaps the value according to the stepCount
   *
   * Note: the maxValue is always inclusive
   *
   * @param value Value to be snapped
   *
   * @return snapped value
   */
  snapToStepCount(value: number): number {
      let lowerLimit;
      let range;

      const lastRange = (this.config.maxValue - this.config.minValue) % this.config.stepCount;
      const lastLimit = this.config.maxValue - lastRange;
      if (value > lastLimit) {    // in case the maxValue is not aligned with stepCount
          lowerLimit = lastLimit;
          range = lastRange;
      } else {
          lowerLimit = this.config.minValue;
          range = this.config.stepCount;
      }

      return Math.round((value - lowerLimit) / range) * range + lowerLimit;
  }

  moveHandle(value: number) {
      const handleOffset = this.handle.nativeElement.offsetWidth / 2;
      this.renderer.setStyle(
          this.handle.nativeElement,
          'left',
          (this.scaleToWidth(value) - handleOffset) + 'px'
      );
  }

  private scaleToWidth(value: number): number {
      return (value - this.config.minValue) / (this.config.maxValue - this.config.minValue) * this.sliderWidth;
  }

  private scaleToValue(position: number): number {
      return position / this.sliderWidth * (this.config.maxValue - this.config.minValue) + this.config.minValue;
  }


  sanitizeConfig() {
      this.config.label = this.config.label ? this.config.label : '';
      this.config.maxValue = this.config.maxValue !== undefined ? this.config.maxValue : 100;
      this.config.minValue = this.config.minValue !== undefined && this.config.minValue < this.config.maxValue
          ? this.config.minValue
          : this.config.maxValue;
      this.config.stepCount = this.config.stepCount > 0 ? this.config.stepCount : 1;
  }

  isValueWithinRange(value: number): boolean {
      return value >= this.config.minValue && value <= this.config.maxValue;
  }
}
