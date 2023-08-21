import { Component, Directive, HostBinding, HostListener, ElementRef, EmbeddedViewRef, Renderer2, Compiler, Injector, NgModuleRef, ComponentRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateService } from '../services/template.service';
import { CommonService } from '../services/common.service';
import { ComponentDropZoneComponent, ElementDropZoneComponent, ImageElement } from '../components/dynamic/dynamic.component';
import { QuickMenuComponent } from '../components/dynamic/editor-menus/menus.component';

@Directive({
  selector: '[arkDraggable]'
})
export class DragDirective {
  private compRef: any = [];
  private tempFramedoc = this.templateService._getTempFrame();
  //private tempFramedoc = this.commonService.tempFrameDoc;
  @HostBinding('class.draggable') draggable = true;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private templateService: TemplateService,
    private commonService: CommonService
  ) {
    let el = this.elementRef.nativeElement;
    el.draggable = 'true';
  }

  @HostListener('dragstart', ['$event']) ondragstart(event: any) { this._dragStarted(event); }
  @HostListener('dragend', ['$event']) ondragend(event: any) { this._dragEnded(event); }

  _dragStarted(event) {
    if (event.stopPropagation) {
      event.stopPropagation(); // Stops some browsers from redirecting.
    }
    let self = this;
    this.renderer.addClass(this.elementRef.nativeElement, 'arkAppdragStarted');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text', event.target.id);

    let elementHtml = this.templateService._getElementDataById(this.templateService.elementList, event.target.id, 'elementHtml');
    let doc = new DOMParser().parseFromString(elementHtml, 'text/html');
    let eleNode = doc.body.firstChild;

    let elem = document.createElement("div");
    elem.id = "dragPreview";
    elem.innerHTML = elementHtml;
    document.body.appendChild(elem);
    if(event.dataTransfer.setDragImage != undefined){
      event.dataTransfer.setDragImage(elem, 10, 10);
    }

    //Dynamically pass dropzone from json and change forEach to Map.
    let elementGroup = this.templateService._getElementDataById(this.templateService.elementList, event.target.id, 'elementGroup');
    this.templateService.draggedElement = elementGroup;
    if (elementGroup.toLowerCase() != 'frames') {
      let element: Array<HTMLElement> = [];
      element = this.tempFramedoc.querySelectorAll("[ark-data=column]")
      Array.prototype.slice.call(element).map(function (currentValue, index, arr) {
        if (currentValue.innerHTML == '') {
          let elDropZone = currentValue;
          const options = { insertMode: 'appendChild', element: elDropZone, class: '' };
          let compref = self.commonService._createDynamicComponent(ElementDropZoneComponent, '', options);
          self.compRef.push(compref);
        }
      });
    }
    else {
      if(this.tempFramedoc.querySelectorAll("[ark-data=section]").length == 0){
        let frmDropZone = this.tempFramedoc.querySelector("[id=templateFrame]");
        let options = { insertMode: 'appendChild', element: frmDropZone, class: '' };
        let compref = self.commonService._createDynamicComponent(ComponentDropZoneComponent, '', options);
        self.compRef.push(compref);
      }
      else{
        Array.prototype.slice.call(this.tempFramedoc.querySelectorAll("[ark-data=section]")).map(function (currentValue, index, arr) {
          let frmDropZone = currentValue;

          let options = { insertMode: 'afterend', element: frmDropZone, class: '' };
          let compref = self.commonService._createDynamicComponent(ComponentDropZoneComponent, '', options);
          self.compRef.push(compref);

          let options1 = { insertMode: 'beforebegin', element: frmDropZone, class: '' };
          let compref1 = self.commonService._createDynamicComponent(ComponentDropZoneComponent, '', options1);
          self.compRef.push(compref1);
        });
      }
    }
  }

  _dragEnded(event) {
    this.renderer.removeClass(this.elementRef.nativeElement, 'arkAppdragStarted');

    this.compRef.map(function (currentValue, index, arr) {
      currentValue.destroy();
    });

    let dragPreview = document.getElementById("dragPreview");
    if (dragPreview.parentNode) {
      dragPreview.parentNode.removeChild(dragPreview);
    }
  }

  ngOnInit() { }
}

@Directive({
  selector: '[arkDroppable]'
})
export class DropDirective {
  private tempFramedoc = this.templateService._getTempFrame();
  //private tempFramedoc = this.commonService.tempFrameDoc;
  private templateWidth = this.templateService._getTemplateWidth();
  private cmpRef: ComponentRef<any>;
  private activeElement: any;
  private compRef: any = [];

  constructor(private elementRef: ElementRef,
    private renderer: Renderer2,
    private templateService: TemplateService,
    private commonService: CommonService) { }

  @HostListener('dragenter', ['$event']) ondragenter(event: any) { this._dragEnter(event); }
  @HostListener('dragleave', ['$event']) ondragleave(event: any) { this._dragLeave(event); }
  @HostListener('dragover', ['$event']) ondragover(event: any) { this._dragOver(event); }
  @HostListener('drop', ['$event']) ondrop(event: any) { this._dropped(event); }

  _dragEnter(event: any) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    this.renderer.removeClass(event.target.offsetParent, 'dropHereFirst');
    if (this.templateService.draggedElement.toLowerCase() != 'frames') {
      this.renderer.addClass(event.target, 'arkAppElementOver');
    }
    else {
      this.renderer.addClass(event.target, 'arkAppSectionOver');
      this.renderer.setStyle(event.target,"min-width",this.templateWidth);
      this.renderer.setStyle(event.target,"max-width",this.templateWidth);
    }
  }

  _dragLeave(event: any) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    this.renderer.removeClass(event.target, 'arkAppElementOver');
    this.renderer.removeClass(event.target, 'arkAppSectionOver');
    if(event.target.offsetParent.nodeName != 'BODY'){
      this.renderer.addClass(event.target.offsetParent, 'dropHereFirst');
    }
  }

  _dragOver(event: any) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    this.renderer.removeClass(event.target.offsetParent, 'dropHereFirst');
    event.dataTransfer.dropEffect = 'move';
    return false;
  }

  _dropped(event: any) {
    if (event.stopPropagation) {
      event.stopPropagation(); // Stops some browsers from redirecting.
    }

    if (event.preventDefault) {
      event.preventDefault();
    }

    let dropedEleHTML: any;
    let self = this;
    let droppedEle = event.dataTransfer.getData("text");
    let id = 0;
    if (droppedEle !== '103') {
      dropedEleHTML = this.templateService._getElementDataById(this.templateService.elementList, droppedEle, 'elementHtml');
      let doc = new DOMParser().parseFromString(dropedEleHTML, 'text/html');
      Array.prototype.slice.call(doc.body.querySelectorAll('[ark-data=container]')).map(currentValue => {
        self.renderer.setStyle(currentValue, 'width', self.templateWidth + 'px');
      });
      let eleNode = doc.body.firstChild;

      this.templateService._setFrameObj(eleNode);

      event.target.parentNode.parentNode.insertBefore(eleNode, event.target.parentNode.nextSibling);
    } else {
          const Imagewidth = event.target.parentNode.firstElementChild.offsetWidth;
          const ImageHeight = event.target.parentNode.firstElementChild.offsetHeight;
          const data = {
            width: Imagewidth,
            height: (Imagewidth > 500) ? Imagewidth * 50 / 100 : Imagewidth
           /// height: ImageHeight
          };
          const compref = self.commonService._createDynamicComponent(ImageElement, data, '');
          self.compRef.push(compref);
          event.target.parentNode.parentNode.insertBefore(compref.location.nativeElement, event.target.parentNode.nextSibling);

    }


    this.renderer.removeClass(event.target, 'arkAppElementOver');
    this.renderer.removeClass(event.target, 'arkAppSectionOver');
  }

  ngOnInit() { }

  // Cleanup properly. You can add more cleanup-related stuff here.
  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    if (this.templateService.quickMenuRef) {
      this.templateService.quickMenuRef.destroy();
    }
  }
}
