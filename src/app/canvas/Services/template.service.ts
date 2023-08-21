import { Injectable, Renderer2, RendererFactory2, Injector, ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef } from '@angular/core';
import { CommonService } from './common.service';
import { Subject, BehaviorSubject,  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ElementList, FrameList, Guideline, templateHtml } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  //Global Variables which can used in canvas.
  public tempFrameValue: any;
  public templateWidth: any;
  public templateName = new BehaviorSubject<string>('');
  public eleCompRef: any;
  public quickMenuRef: any;
  public advanceMenuRef: any;
  public elementList: any = [];
  public boxMenuList: any = [];
  public draggedElement: any;
  public isRulerClicked = new Subject<boolean>();
  public guideLines: Guideline[] = [];
  public iframeBody = new Subject<any>();
  public iframeBodyHeight = new Subject<any>();
  private renderer: Renderer2;
  private rulerInfo = new Subject<number>();
  private DeviceWidth = new Subject<number>();
  private templateGridWidth: number;
  private frameInfo = new Subject<any>();
  templateframeWidth =  new BehaviorSubject<number>(this._getTemplateWidth());
  templateframeHeight =  new BehaviorSubject<number>(this.commonService._getScreenHeight() - 76);
  public selectedElement: any;
  public eventValue: any = '';
  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    private rendererFactory: RendererFactory2,
    private _resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // get template width
  // return number
  _getTemplateWidth() {
    return this.templateWidth;
  }

  // set template width
  // return number
  _setTemplateWidth(width) {
    this.templateframeWidth.next(width);
  }

  // set template Height
  // return number
  _setTemplateHeight(height) {
    this.templateframeHeight.next(height);
  }

  // get rulerOffset
  // return number
  _getRulerOffset() {
    let templateWidth: number;
    this.templateframeWidth.subscribe(x => {templateWidth = x;});
    return Math.ceil(((this.commonService._getScreenWidth() - templateWidth) / 2) % 100) + 1;
  }

  // return ScreenWidth - TemplateWidth
  // return number
  _getLeftScreenWidth(){
    let templateWidth: number;
    this.templateframeWidth.subscribe(x => {templateWidth = x;});
    return this.commonService._getScreenWidth() - templateWidth;
  }

  // return ScreenWidth - TemplateWidth
  // return number
  _getDeviceWidth() {
    return this.DeviceWidth;
  }

  // return ScreenWidth - TemplateWidth
  // return number
  _setDeviceWidth(width) {
    this.DeviceWidth.next(width);
  }

  // get ruler measures
  // return array of numbers
  _getTemplateRulerMeasure() {
    let templateWidth: number;
    this.templateframeWidth.subscribe(x => {templateWidth = x;});
    let GuideMeasure: number[] = [];
    let rulerOffset = this._getLeftScreenWidth() / 2;
    let templateOffset = templateWidth + rulerOffset;
    this._generateRulerMeasure(rulerOffset, GuideMeasure, 100, 'des');
    this._generateRulerMeasure(templateOffset, GuideMeasure, 0, 'ase');
    return GuideMeasure;
  }

  // generate ruler measure
  // return nothing
  _generateRulerMeasure(width: any, GuideMeasure: any, incrementVal: any, order: any) {
    let increment: number = incrementVal;
    let arrayNumbers: number[] = [];
    for (increment; increment <= width; increment = increment + 100) {
      if (increment !== width)
        arrayNumbers.push(increment);
    }
    if (order !== 'ase') {
      arrayNumbers = arrayNumbers.reverse();
      for (let i = 0; i < arrayNumbers.length; i++)
        GuideMeasure.push(arrayNumbers[i]);
    } else {
      for (let i = 0; i < arrayNumbers.length; i++)
        GuideMeasure.push(arrayNumbers[i]);
    }
  }

  _getGuideInfo() {
    return this.rulerInfo;
  }

  _putGuideInfo(guideInfo) {
    let rulerOffset = this._getLeftScreenWidth() / 2;
    this.rulerInfo.next(guideInfo - rulerOffset);
  }

  _getGridLayout(width){
    this.templateframeWidth.subscribe(x => {this.templateGridWidth = x * 8.33333333 / 100;});
    let gridData: any = [];
    let i = this.templateGridWidth;
    for (i; i <= width; i = i + this.templateGridWidth) {
      let data;
      data = { width: this.templateGridWidth };
      gridData.push(data);
    }
    return gridData;
  }

  _getGridLayoutOffset(width) {
    return -Math.ceil(this.templateGridWidth - Math.floor(width % this.templateGridWidth));
  }

  _getguideId() {
    if (this.guideLines.length > 0) {
      return this.guideLines[this.guideLines.length - 1].Id + 1;
    } else { return 0; }
  }

  _getguideInstance(id) {
    return this.guideLines.filter(guide => { if (guide.Id == id) return guide; });
  }

  _setTempFrame(tempFramedoc: any) {
    this.tempFrameValue = tempFramedoc;

    // this.tempFrameValue = document;

    // this.commonService.tempFrameDoc = this.tempFrameValue;
  }

  _getTempFrame() {
    return this.tempFrameValue;
  }

  //get element list from web service.
  _getElements(): Observable<any> {

    let url = "./assets/data/elements.json";
    //let url = "./api/editor/elements/LP";


    return this.http.get(url);
  }

  //get HTML from element list json by passing element name.
  _getElementHTML(elementList: any, elementName: any) {
    let elementHTML: HTMLElement;
    elementList.map(function (currentValue, index, arr) {
      if (currentValue.elementType.toLowerCase() == elementName.toLowerCase()) {
        elementHTML = currentValue.elementHtml;
      }
    });

    return elementHTML;
  }

  //get element data from elementList JSON by passing any field name.
  _getEleData(elementList: any, elementName: any, field: any){
    let fieldValue: any;
    elementList.map(function (currentValue, index, arr) {
      if (currentValue.elementType.toLowerCase() == elementName.toLowerCase()) {
        fieldValue = currentValue[field];
      }
    });

    return fieldValue;
  }

  //get element data by ID from elementList JSON by passing any field name.
  _getElementDataById(elementList: any, elementId: any, field: any){
    let fieldValue: any;
    elementList.map(function (currentValue, index, arr) {
      if (currentValue.elementId == elementId) {
        fieldValue = currentValue[field];
      }
    });

    return fieldValue;
  }

  //get Box Menu from web service.
  _getBoxMenu(): Observable<any> {
    let url = "./assets/data/BoxMenu.json";

    return this.http.get(url);
  }

  //get Saved Template from web service.
  _getSavedTemp(): Observable<templateHtml[]> {
    let url = "./assets/data/savedTemplate.json";

    return this.http.get<templateHtml[]>(url);
  }

  _setFrameObj(msg: any) {
    this.frameInfo.next({ text: msg });
  }

  _getFrameObj(): Observable<any> {
    return this.frameInfo.asObservable();
  }

  //Disables all the active box, menu , contentEditable and destroys menu component.
  _disableActiveBox() {
    let self = this;
    let arkAppActiveBox: Array<HTMLElement> = [];
    let arkAppActiveRow: Array<HTMLElement> = [];
    let boxMenu: Array<HTMLElement> = [];
    let overlay: Array<HTMLElement> = [];    
    let contenteditable: Array<HTMLElement> = [];    
    let arkAppActiveBoxLabel: Array<HTMLElement> = [];
    let arkAppActiveColLabel: Array<HTMLElement> = [];
    this.eventValue = '';

    arkAppActiveBox = this.tempFrameValue.querySelectorAll(".arkAppActiveBox");
    arkAppActiveRow = this.tempFrameValue.querySelectorAll(".arkAppActiveRow");
    boxMenu = this.tempFrameValue.querySelectorAll('*[id^="boxMenu"]');
    overlay = this.tempFrameValue.querySelectorAll('*[id^="overlay"]');    
    contenteditable = this.tempFrameValue.querySelectorAll("[contenteditable=true]");
    arkAppActiveBoxLabel = this.tempFrameValue.querySelectorAll('*[id^="arkActiveBoxLabel"]');
    arkAppActiveColLabel = this.tempFrameValue.querySelectorAll('*[id^="arkActiveColLabel"]');

    Array.prototype.slice.call(arkAppActiveBox).map(function (currentValue, index, arr) {
      self.renderer.removeClass(currentValue, "arkAppActiveBox");
      let node = currentValue.querySelector("#boxIcon");
      node.parentNode.removeChild(node);
    });

    Array.prototype.slice.call(arkAppActiveBoxLabel).map(function (currentValue, index, arr) {
      currentValue.parentNode.removeChild(currentValue.childNodes[0].parentNode);
    });

    Array.prototype.slice.call(arkAppActiveColLabel).map(function (currentValue, index, arr) {
      currentValue.parentNode.removeChild(currentValue.childNodes[0].parentNode);
    });

    Array.prototype.slice.call(arkAppActiveRow).map(function (currentValue, index, arr) {
      self.renderer.removeClass(currentValue, "arkAppActiveRow");
    });

    Array.prototype.slice.call(this.tempFrameValue.querySelectorAll(".arkAppActiveComp")).map(function (currentValue, index, arr) {
      self.renderer.removeClass(currentValue, "arkAppActiveComp");
    });

    Array.prototype.slice.call(this.tempFrameValue.querySelectorAll(".arkAppActiveEle")).map(function (currentValue, index, arr) {
      self.renderer.removeClass(currentValue, "arkAppActiveEle");
    });

    Array.prototype.slice.call(boxMenu).map(function (currentValue, index, arr) {
      let node = currentValue.parentNode;
      node.parentNode.removeChild(node);

      if(self.commonService.boxCompRef != undefined){
        self.commonService.boxCompRef.destroy();
      }
    });

    Array.prototype.slice.call(document.querySelectorAll('*[class^="editor-quick-menu"]')).map((currentValue, index, arr) => {
      const node = currentValue;
      node.parentNode.removeChild(node);

      if (!!self.quickMenuRef === true) {
        self.quickMenuRef.destroy();
      }
    });

    Array.prototype.slice.call(this.tempFrameValue.querySelectorAll('*[class^="editor-quick-menu"]')).map((currentValue, index, arr) => {
      const node = currentValue;
      node.parentNode.removeChild(node);

      if (!!self.quickMenuRef === true) {
        self.quickMenuRef.destroy();
      }
    });

    Array.prototype.slice.call(overlay).map(function (currentValue, index, arr) {
      let node = currentValue;
      node.parentNode.removeChild(node);
    });    

    Array.prototype.slice.call(contenteditable).map(function (currentValue, index, arr) {
      currentValue.removeAttribute("contenteditable");
    });
  }

  // Create a background overlay. once clicked on this overlay div disable all the activeboxes.
  _createOverlayDiv() {
    let self = this;
    const elementData = { class: ['arkAppOverlay'], id: 'overlay', attr: '' };
    const overlayDiv = this.commonService._createDynamicElement('div', elementData, '');
    let tempfrmBody = this.tempFrameValue.querySelector("body");
    this.renderer.insertBefore(tempfrmBody, overlayDiv, tempfrmBody.firstChild);

    Array.prototype.slice.call(this.tempFrameValue.querySelectorAll('*[id^="overlay"]')).map(function (currentValue, index, arr) {
      self.renderer.listen(currentValue, 'click', (event) => {
        self._disableActiveBox();
      });
    });
  }
}
