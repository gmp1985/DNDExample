import {  Injectable, ComponentFactoryResolver, Injector, ApplicationRef, EmbeddedViewRef, Renderer2, RendererFactory2 } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // Global variables.
  public elementList: any;
  private renderer: Renderer2;
  public selectedBoxMenu: any;
  public boxCompRef: any;
  public boxSettingsRef: any;
  public boxAppRef: any;
  public vFrameDoc: any;
  public isBrowseClicked: boolean;
  public filebrowse: string;

  constructor(
    private compFactRes: ComponentFactoryResolver,
    private _resolver: ComponentFactoryResolver,
    private injector: Injector,
    public appRef: ApplicationRef,
    private rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // get browser screen width
  // return a number
  public _getScreenWidth() {
    return window.innerWidth;
  }

  // get browser screen height
  // return a number
  public _getScreenHeight() {
    return window.innerHeight;
  }

  /* create dynamic component
    inputs component_class_name, component data, component options [insertMode:(appendChild, insertBefore), element: [element_reference, class_name]]
    return component reference
  */
  public _createDynamicComponent(component: any, data: any, options: any) {
    const compFactory = this.compFactRes.resolveComponentFactory(component);
    const compRef = compFactory.create(this.injector);
    const compInstance: any = compRef.instance;
    compInstance.data = data;
    const compElement = (compRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.appRef.attachView(compRef.hostView);
    switch (options.insertMode) {
      case 'appendChild': this._getNativeElement(options).appendChild(compElement); break;
      case 'prepend': this._getNativeElement(options).prepend(compElement); break;
      case 'insertBefore': compElement.insertBefore(compElement, this._getNativeElement(options)); break;
      case 'afterbegin': this._getNativeElement(options).insertAdjacentElement('afterbegin', compElement); break;
      case 'afterend': this._getNativeElement(options).insertAdjacentElement('afterend', compElement); break;
      case 'beforebegin': this._getNativeElement(options).insertAdjacentElement('beforebegin', compElement); break;
      case 'beforeend': this._getNativeElement(options).insertAdjacentElement('beforeend', compElement); break;
    }

    return compRef;
  }

  /**
   * Function to destroy dynamic component
   * @param compRef
   */
  _destroyDynamicComponent(compRef: any){
    if(compRef !== undefined){
      compRef.destroy();
      let hostViewRef = compRef.hostView;
      if (hostViewRef.destroyed && hostViewRef.rootNodes.length !== 0){
        compRef.location.nativeElement.remove();
      }
    }
  }

  // Creating element reference
  // input takes options [insertMode:(appendChild, insertBefore), element: [element_reference, class_name]]
  public _getNativeElement(options) {
    if (options.element !== '' && options.element !== null)
      return options.element;
    else
      return document.querySelectorAll('.' + options.class)[0];
  }

  // Create Dynamic Element.
  // Inputs element(DIV, SECTION, SPAN, etc...) to create, element data(id, class, attr), Text to append in Element.
  // id is a string(you can pass only one id), class is an 1 dimension array (Eg. ['class1','class2']),
  // attr is 2 dimenstion array(Eg. [['attrKey','attrValue'],['attrKey','attrValue']])
  // return element created by appending all the data and text.
  public _createDynamicElement(element: any, eleData: any, text: any) {
    const dynElement = this.renderer.createElement(element);
    const dynText = this.renderer.createText(text);
    let self = this;

    if(eleData.id != '' && eleData.id != undefined){
      this.renderer.setProperty(dynElement, 'id', eleData.id);
    }

    if (eleData.class != '' && eleData.class != undefined) {

      eleData.class.map(function (currentValue, index, arr) {
        self.renderer.addClass(dynElement, currentValue);
      });
    }

    if (eleData.attr != '' && eleData.attr != undefined) {
      eleData.attr.map(function (currentValue, index, arr) {
        self.renderer.setAttribute(dynElement, currentValue[0], currentValue[1]);
      });
    }

    this.renderer.appendChild(dynElement, dynText);
    return dynElement;
  }

  // Finding parent container node of passed element.
  // Inputs child Element, parent element class or attribute.
  // Returns passed parent node.
  public _getElementParent(ele: any, parentele: any) {
    let b: any;
    let a = ele;
    let els = [];
    while (a) {
      els.unshift(a);
      a = a.parentNode;
      if (a != null) {
        if (a.querySelector(parentele) == null) {
          b = a;
        }
      }
    }

    return b;
  }

  /**
   * _getImageSize()
   *
   * params (image, recomended_width, recomended_width)
   *
   * return object { width: newvalue, height: newvalue}
   */
  public _getResizedImageSize(data) {
      const imageURL = data.image;
      const checkImage = (imageoption) =>
      new Promise(resolve => {
          const img = new Image();
          img.onload = (img) => resolve(this._calculateSize(img, imageoption));
          img.onerror = () => resolve(this._calculateSize(img, imageoption));
          img.src = imageoption.image;
      });
      return checkImage(data);
  }

  public _calculateSize(img, data){
      const image = img.target;
      let ratio = 0;
      let newHeight = 0;
      let newWidth = 0;
      const Rwidth: number = data.width;
      const Rheight: number = data.height;
      const imageWidth: number = image.width;
      const imageHeight: number = image.height;
      let result = {width: image.width, height: image.height};

      if (imageWidth >= Rwidth) {
        ratio = Rwidth / imageWidth;
        newHeight = imageHeight * ratio;
        newWidth = imageWidth * ratio;
        // both new sizes are less than required sizes
        if (newHeight <= Rheight && newWidth <= Rwidth) {
            result.height = newHeight;
            result.width = newWidth;
            return result;
        } else if (newHeight >= Rheight) {
            ratio = Rheight / newHeight;
            newWidth = newWidth * ratio;
            newHeight = newHeight * ratio;
            // both new sizes are less than required sizes
            if (newHeight <= Rheight && newWidth <= Rwidth) {
              result.height = newHeight;
              result.width = newWidth;
              return result;
            }
        }
      } else if (imageHeight >= Rheight) {
        ratio = Rheight / imageHeight;
        newWidth = imageWidth * ratio;
        newHeight = imageHeight * ratio;
        // both new sizes are less than required sizes
        if (newHeight <= Rheight && newWidth <= Rwidth) {
          result.height = newHeight;
          result.width = newWidth;
          return result;
        } else if (newWidth >= Rwidth) {
          ratio = Rwidth / newWidth;
          newHeight = newHeight * ratio;
          newWidth = newWidth * ratio;
          if (newHeight <= Rheight && newWidth <= Rwidth) {
            result.height = newHeight;
            result.width = newWidth;
            return result;
          }
        }
      } else {
        return result;
      }
  }
}
