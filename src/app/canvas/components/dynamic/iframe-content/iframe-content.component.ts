import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Renderer2, Compiler, Injector, NgModuleRef, ComponentRef, ElementRef, ChangeDetectorRef, NgModuleFactoryLoader, Input, EmbeddedViewRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TemplateService } from 'src/app/canvas/services/template.service';
import { CommonService } from 'src/app/canvas/services/common.service';
import { EditorMenusService } from '../../../services/editor-menus.service';
import { BoxMenusComponent } from '../box-menus/box-menus.component';
import { QuickMenuComponent } from '../editor-menus/menus.component';


@Component({
  selector: 'ark-iframe-content',
  templateUrl: './iframe-content.component.html',
  styleUrls: ['./iframe-content.component.css']
})
export class IframeContentComponent implements OnInit, AfterViewInit, OnDestroy {
  private templateWidth: any;
  private elementHTML: any;
  frameInfo: any[] = [];
  subscription: Subscription;
  content: string;
  private activeElement: any;
  private cmpRef: ComponentRef<any>;
  public pasteFlag = false;
  public eventValue = '';
  @Input() data: any;

  @ViewChild('vc', { read: ElementRef }) vc: ElementRef;

  constructor(private templateService: TemplateService,
    private commonService: CommonService,
    private editorMenusService: EditorMenusService,
    private renderer: Renderer2) {
    // subscribe to call shoboxMenu when frameInfo obj is updated
    this.subscription = this.templateService._getFrameObj().subscribe(frameInfo => {
      if (frameInfo) {
        //this._showBoxMenu();                
        this.frameInfo.push(frameInfo);
        this._addListeners(this.frameInfo[this.frameInfo.length - 1]['text']);
      } else {
        // clear frameInfo.
        this.frameInfo = [];
      }
    });
  }

  ngOnInit() {
    if (this.templateService.boxMenuList.length === 0) {
      this.templateService._getBoxMenu()
        .subscribe((data: any) => {
          //this.boxMenuList = data;
          this.templateService.boxMenuList = data;
        }, (error) => { console.log("errror"); });
    } else {
      //this.boxMenuList = this.templateService.boxMenuList;
    }
  }

  ngAfterViewInit() {
    let id = 0;
    this.templateWidth = this.templateService._getTemplateWidth();
    this.elementHTML = this.data.sectionHTML;

    const self = this;
    const doc = new DOMParser().parseFromString(this.elementHTML, 'text/html');
    let eleNode = doc.body;
    let sectionNodes: Array<any> = [];
    for (let i = 0; i < eleNode.children.length; i++) {
      self._addListeners(eleNode.children[i]);

      sectionNodes.push(eleNode.children[i]);
    }

    for (let i = 0; i < sectionNodes.length; i++) {
      this.vc.nativeElement.appendChild(sectionNodes[i]);
    }

    Array.prototype.slice.call(this.templateService.tempFrameValue.querySelectorAll('[ark-data=container]')).map(currentValue => {
      self.renderer.setStyle(currentValue, 'width', self.templateWidth + 'px');
    });
  }

  /**
   * Adds mouseEnter, click, mouseLeave events to all the existing column / elements in templates to display menu, highlighting column, showing label of the column / elements.    
   * @param {*} eleNode - elementNode to be passed   
   */
  _addListeners(eleNode: any) {
    let eleSelector: Array<HTMLElement> = [];
    let nodeSelector: Array<HTMLElement> = [];
    let eleAttrData: any = '';

    if (eleNode.getAttribute("ark-data") == 'column') {
      eleSelector.push(eleNode);
    }
    else {
      eleSelector = eleNode.querySelectorAll('[ark-data=column]');
      if (eleSelector.length == 0) {
        nodeSelector.push(eleNode);
      }

      if (nodeSelector.length == 0) {
        const elementListData = ['[ark-data=heading]', '[ark-data=text]', '[ark-data=image]', '[ark-data=button]'];
        for (var key in elementListData) {
          if (eleNode.querySelectorAll(elementListData[key]).length != 0) {
            nodeSelector.push(eleNode.querySelectorAll(elementListData[key]));
          }
        }
      }
    }

    const self = this;
    if (eleSelector.length != 0) {
      Array.prototype.slice.call(eleSelector).map(currentValue => {
        currentValue.addEventListener('mouseenter', function (event: any) {
          event.stopPropagation();
          event.preventDefault();

          let activeBox = self.templateService.tempFrameValue.querySelector("#arkActiveBoxLabel");
          if (event.target.querySelectorAll('*[id^="boxIcon"]').length == 0 && event.target.querySelector("[ark-data=row]") == null) {
            const elementData = { class: ['boxIconDIv', 'material-icons'], id: 'boxIcon', attr: '' };
            const boxIconDiv = self.commonService._createDynamicElement('div', elementData, 'more_horiz');

            boxIconDiv.addEventListener('click', function (event: any) {
              if (event.stopPropagation()) {
                event.stopPropagation();
              }
              if (event.preventDefault()) {
                event.preventDefault();
              }

              self.templateService._disableActiveBox();
              if (self.templateService.tempFrameValue.querySelectorAll('*[id^="boxMenu"]').length === 0) {
                const data = { ele: boxIconDiv.parentNode };
                const options = { insertMode: 'beforebegin', element: this, class: '' };

                self.commonService.selectedBoxMenu = boxIconDiv.parentNode;

                self.commonService.boxCompRef = self.commonService._createDynamicComponent(BoxMenusComponent, data, options);

                self.renderer.addClass(boxIconDiv.parentElement, 'arkAppActiveBox');
                eleAttrData = boxIconDiv.parentNode.getAttribute("ark-data");

                const boxLblData = { class: ['arkAppActiveBoxLabel'], id: 'arkActiveBoxLabel', attr: '' };
                const boxLblDiv = self.commonService._createDynamicElement('div', boxLblData, self.templateService.boxMenuList[eleAttrData]["displayValue"]);
                self.renderer.appendChild(boxIconDiv.parentNode, boxLblDiv);

                //Finding parent container node of selected.
                let parentContainer = self.commonService._getElementParent(boxIconDiv, "[ark-data=container]");
                self.renderer.addClass(parentContainer, "arkAppActiveComp");

                boxIconDiv.parentNode.removeChild(boxIconDiv);
                //Creating overlay div when any box is active
                self.templateService._createOverlayDiv();

                //self.renderer.setStyle(boxIcon,'display','block');
              }

              currentValue.removeEventListener('mouseenter', function (event: any) { return false; }, true);
            });

            if (activeBox == null) {
              eleAttrData = event.target.getAttribute("ark-data");
              const boxLblData = { class: ['arkAppActiveBoxLabel'], id: 'arkActiveColLabel', attr: '' };
              const boxLblDiv = self.commonService._createDynamicElement('div', boxLblData, self.templateService.boxMenuList[eleAttrData]["displayValue"]);
              self.renderer.appendChild(event.target, boxLblDiv);
            }

            self.renderer.appendChild(this, boxIconDiv);
          }
        });

        currentValue.addEventListener('mouseleave', function (event: any) {
          event.stopPropagation();
          event.preventDefault();

          if (this.querySelectorAll('*[id^="boxIcon"]').length > 0 && this.querySelectorAll('*[id^="boxMenu"]').length == 0) {
            let node = this.querySelectorAll('*[id^="boxIcon"]');
            Array.prototype.slice.call(node).map(currentValue => {
              currentValue.parentNode.removeChild(currentValue);
            });
          }

          if (this.querySelectorAll('*[id^="arkActiveColLabel"]').length > 0) {
            let node = this.querySelectorAll('*[id^="arkActiveColLabel"]');
            Array.prototype.slice.call(node).map(currentValue => {
              currentValue.parentNode.removeChild(currentValue);
            });
          }

          return false;
        });
      });
    }

    if (nodeSelector.length != 0) {
      Array.prototype.slice.call(nodeSelector).map(currentValue => {
        if (currentValue.length != undefined) {
          Array.prototype.slice.call(currentValue).map(currentValue => {
            self._addElementListeners(currentValue);
          });
        }
        else {
          self._addElementListeners(currentValue);
        }
      });
    }
  }

  /**
   * Adds doubleClick, paste events to all the existing elements in templates. (all the listeners like keyup, keyPress, etc can be added here),
   * @param {*} element - nodeElements to be passed   
   */
  _addElementListeners(element: any) {
    let self = this;
    let eleNodeName: any;
    self.renderer.listen(element, 'mouseenter', (event: any) => {
      event.preventDefault();

      let elementActive = event.target.classList.contains("arkAppActiveEle");
      if (!elementActive) {
        eleNodeName = event.target.nodeName;
        if (event.target.nodeName == 'DIV') {
          eleNodeName = event.target.childNodes[0].nodeName;
        }

        const boxLblData = { class: ['arkAppEleHoverLabel'], id: 'arkActiveElementLabel', attr: '' };
        const boxLblDiv = self.commonService._createDynamicElement('div', boxLblData, eleNodeName);

        event.target.insertAdjacentElement('beforebegin', boxLblDiv);
      }
    });

    self.renderer.listen(element, 'mouseleave', (event: any) => {
      event.stopPropagation();
      event.preventDefault();

      if (self.templateService.tempFrameValue.querySelectorAll('*[id^="arkActiveElementLabel"]').length > 0) {
        let node = self.templateService.tempFrameValue.querySelectorAll('*[id^="arkActiveElementLabel"]');
        Array.prototype.slice.call(node).map(currentValue => {
          currentValue.parentNode.removeChild(currentValue);
        });
      }

      return false;
    });

    element.addEventListener('dblclick', function (event: any) {
      event.preventDefault();

      self._elementDblClick(event);
    });


    self.renderer.listen(element, 'paste', (event) => {
      event.preventDefault();

      self._pasteContent(event);
    });
  }

  /**
   * Functionality when elements double click is done is written here (eg. adding contentEditable true, showing quickmenu editors, etc).
   * @param {*} event - event to be passed   
   */
  _elementDblClick(event: any) {
    let self = this;
    if (event.stopPropagation()) {
      event.stopPropagation();
    }
    self.templateService._disableActiveBox();
    let selectedEle = event.target;
    let eleNodeName = selectedEle.getAttribute("ark-data");
    if (selectedEle.getAttribute("ark-data") == null) {
      selectedEle = event.target.parentNode;
      eleNodeName = selectedEle.getAttribute("ark-data");
    }

    let isContentEditable = this.templateService._getEleData(this.templateService.elementList, eleNodeName, 'contentEditable');
    if (isContentEditable == "true") {
      if(selectedEle.getAttribute("ark-data") == 'button'){
        self.renderer.setAttribute(selectedEle.querySelector("span"), 'contenteditable', 'true');
        selectedEle.querySelector("span").focus();
      }
      else{
        self.renderer.setAttribute(selectedEle, 'contenteditable', 'true');
        selectedEle.focus();
      }      

      /*self.renderer.listen(self.templateService.tempFrameValue.querySelector("[contenteditable=true]"), 'paste', (event) => {
        event.preventDefault();
        let text = event.clipboardData.getData("text/plain");
        text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
        self.templateService.tempFrameValue.execCommand("insertHTML", false, text);
      });*/

      self.renderer.listen(self.templateService.tempFrameValue.querySelector('[contenteditable=true]'), 'keypress', evt => {
        // evt.preventDefault();
        //console.log(evt);
        this.enterKeyPressHandler(evt);
        document.execCommand('defaultParagraphSeparator', false, 'div');
        const headerRegex = new RegExp('<\/?h[1-6]>', 'ig');
        if (evt.target.getAttribute('ark-data') === 'heading') {
          if (!headerRegex.test(evt.target.innerHTML)) {
            evt.target.innerHTML = '<h1></br></h1>';
          }
        }
      });

      self.renderer.listen(self.templateService.tempFrameValue.querySelector("[contenteditable=true]"), 'drop', (event) => {
        event.preventDefault();
        return false;
      });
    }

    self.renderer.addClass(selectedEle, 'arkAppActiveEle');

    //Finding parent container node of selected.
    let parentContainer = self.commonService._getElementParent(selectedEle, "[ark-data=container]");
    self.renderer.addClass(parentContainer, "arkAppActiveComp");

    //Creating overlay div when any box is active
    self.templateService._createOverlayDiv();

    let editorOptPromise = new Promise((resolve, reject) => {
      // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
      // In this example, we use setTimeout(...) to simulate async code.         
      const elementData = { class: ['dummyDiv'], id: 'dummyDiv', attr: '' };
      const dummyDiv = self.commonService._createDynamicElement('div', elementData, '');
      parentContainer.insertAdjacentElement('afterbegin', dummyDiv);

      //Call Editor Menu Function here
      self._eleEditorOptions(selectedEle);

      setTimeout(function () {
        resolve("Success!");
      }, 250);
    });

    editorOptPromise.then((successMessage) => {
      // successMessage is whatever we passed in the resolve(...) function above. 
      let dummyDiv = this.templateService.tempFrameValue.querySelector("#dummyDiv");
      //this.templateService.tempFrameValue.querySelector("#dummyDiv").remove();
      dummyDiv.parentNode.removeChild(dummyDiv.childNodes[0].parentNode);
    });
  }

  enterKeyPressHandler(evt) {

    let addedBr = false;
    const charCode = evt.which || evt.keyCode;
    if (charCode === 13) {
      if (typeof typeof window.getSelection !== 'undefined') {
        const sel = this.templateService.tempFrameValue.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const br = document.createElement('br');
          range.insertNode(br);
          range.setEndAfter(br);
          range.setStartAfter(br);
          sel.removeAllRanges();
          sel.addRange(range);
          addedBr = true;
        }
      } else {
        const sel = this.templateService.tempFrameValue.getSelection();
        if (sel.createRange) {
          const range = sel.createRange();
          range.pasteHTML('<br>');
          range.select();
          addedBr = true;
        }
      }
    }
    // If successful, prevent the browser's default handling of the keypress
    if (addedBr) {
      if (typeof evt.preventDefault !== 'undefined') {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
    }
  }

  /**
   * Paste pure plain text content,
   * @param {*} event - event to be passed   
   */
  _pasteContent(event: any) {
    let self = this;
    let text = '';
    let clp = (event.originalEvent || event).clipboardData;
    if (clp == undefined || clp == null) {
      text = (<any>window).clipboardData.getData("Text") || "";
      text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
      if (text != "") {
        if (window.getSelection) {
          var newNode = self.templateService.tempFrameValue.createElement("span");
          newNode.innerHTML = text;
          self.templateService.tempFrameValue.getSelection().getRangeAt(0).insertNode(newNode);
        } else {
          self.templateService.tempFrameValue.selection.createRange().pasteHTML(text);
        }
      }
    }
    else {
      text = (event.originalEvent || event).clipboardData.getData('text/plain');
      text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
      self.templateService.tempFrameValue.execCommand("insertHTML", false, text);
    }
  }

  /**
   * Element Editor Options (QuickMenuOptions, AdvanceMenuOptions) will be shown.
   * @param {*} element - element to be edited
   * @memberof TemplateFrameComponent
   */
  _eleEditorOptions(element: any) {
    const elem = element.getAttribute('ark-data');
    const clintRec = element.getClientRects()[0];
    const scrollTop = document.querySelector(".iframeWrapper").scrollTop;
    const top = clintRec.top - scrollTop + 76;
    const left = clintRec.left;    
    const data = { activeElement: element, topPosition: top, leftPosition: left, options: this.editorMenusService.editorOptions[elem] };
    const options = { insertMode: 'beforebegin', element: '', class: 'ark-quick-menu' };
    this.templateService.quickMenuRef = this.commonService._createDynamicComponent(QuickMenuComponent, data, options);
  }

  // Cleanup properly. You can add more cleanup-related stuff here.
  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}
