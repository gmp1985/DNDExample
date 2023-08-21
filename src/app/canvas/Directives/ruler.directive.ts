import { Directive, Renderer2, HostListener, OnInit, Input, Output, EventEmitter, ElementRef, ComponentRef } from '@angular/core';
import { RulerLineComponent, RulerGuideInfoComponent, RulerGuideMenuComponent } from '../components/dynamic/dynamic.component';
import { CommonService } from './../services/common.service';
import { TemplateService } from './../services/template.service';


@Directive({
  selector: '[arkRuler]'
})
export class RulerDirective {

  constructor(
    private element: ElementRef,
    private commonservice: CommonService,
    private templateservice: TemplateService
  ) { }

  // click dblclick drag dragover mousedown mouseover mouseup
  @HostListener('click', ['$event'])
  onMouseClick(e: any) {
    if(!e.target.classList.contains('workareaborder')) {
      // pushing guide info
      //console.log(this.templateservice.guideLines);
      const guideinfo = {Left: e.clientX, Locked: false, Id: this.templateservice._getguideId(), Ref: null };
      this.templateservice.guideLines.push(guideinfo);
      // creating guide line
      const options = {insertMode: 'appendChild', element: '', class: 'guide-lines'};
      let guideRef = this.commonservice._createDynamicComponent(RulerLineComponent, guideinfo, options);
      this.templateservice.guideLines.map(guide => {
        if(guide.Id === guideinfo.Id){
          guide.Ref = guideRef;
        }
      })
    }
  }
}





@Directive({
  selector: '[rulerline]'
})
export class RulerLineDirective implements OnInit {
  @Input() Left: string;
  @Output() CurrentLeft: EventEmitter<string> = new EventEmitter();
  testValue:number;
  isdraggable= false;
  inforef: ComponentRef<any>;
  menuref: ComponentRef<any>;


  private isDragging = false;

    @HostListener('dblclick', ['$event']) ondblclick(e: any): void {
      this._openRulerMenu(e);
      this.templateservice.isRulerClicked.next(false);
      this.isDragging = false;
      this.isdraggable = false;

    }

    @HostListener('pointerdown', ['$event']) onPionterDown(e: any): void {
      let guideId:number;
      let index:number;
      if(e.ctrlKey){
        this._openRulerMenu(e);
        this.templateservice.isRulerClicked.next(false);
      } else{
        if (e.target.classList.contains('rulerLine')) {
          guideId = parseInt(e.target.getAttribute('data-id'));
          if(this.templateservice.guideLines.length>1){
            index = this.templateservice.guideLines.map((guide, index) => { if (guide.Id === guideId) {return index; } }).filter(i => i !== undefined)[0];
          } else {
            index = 0;
          }
          if (!this.templateservice.guideLines[index].Locked) {
            this.templateservice.isRulerClicked.next(true);
            this.isDragging = true;
            this.isdraggable = true;
          }
        }
      }
    }


    @HostListener('document:pointermove', ['$event']) onPionterMove(e: PointerEvent): void {
      if(this.isDragging){
        this._dragRulerline(e);
      }else{
        return;
      }
    }



    @HostListener('document:pointerup', ['$event']) onPionterUp(e: PointerEvent): void {
      if (this.isDragging) {
        this._removedragInfo(e.clientX);
        this.isDragging = false;
        this.isdraggable = false;
        this.templateservice.isRulerClicked.next(false);
      } else {
        return;
      }
    }

  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private commonservice: CommonService,
    private templateservice: TemplateService
  ) { }

  ngOnInit() {
    let position = this.Left + 'px';
    this.renderer.addClass(this.element.nativeElement, 'rulerLine');
    this.renderer.addClass(this.element.nativeElement, 'fixed');
    this._addLeft(position);
  }

  _addLeft(left) {
    this.renderer.setStyle(this.element.nativeElement, 'left', left);
  }

  _dragRulerline(event) {
    this.templateservice._putGuideInfo(event.clientX);
    this.renderer.removeClass(this.element.nativeElement, 'fixed');
    if(this.menuref != undefined){
      this.menuref.destroy();
    }
    const data = { Left: event.clientX + 'px', Top: event.clientY + 'px' };
    const options = {insertMode: 'appendChild', element: this.element.nativeElement, class: ''};
    if (this.element.nativeElement.querySelectorAll('.rulerguideinfo').length == 0)
      this.inforef = this.commonservice._createDynamicComponent(RulerGuideInfoComponent, data, options);
    this._addLeft(data.Left);
  }

  _createdragInfo(left) {

  }

  _removedragInfo(left) {
    this._addLeft(left + 'px');
    this.renderer.addClass(this.element.nativeElement, 'fixed');
    if(typeof this.inforef !== 'undefined')
    this.inforef.destroy();
  }

  _openRulerMenu(event) {
    const guideInfo = this.templateservice._getguideInstance(event.target.getAttribute('data-id'));
    const data = { Left: event.clientX, Top: event.clientY, Guide: guideInfo};
    const options = {insertMode: 'appendChild', element: this.element.nativeElement, class: ''};
    this._addLeft(data.Left);
    if (this.element.nativeElement.querySelectorAll('.rulerguidemenu').length == 0)
      this.menuref = this.commonservice._createDynamicComponent(RulerGuideMenuComponent, data, options);
    else
      this.menuref.destroy();
  }

}
