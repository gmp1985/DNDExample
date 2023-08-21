import { Injectable, EmbeddedViewRef, Renderer2, RendererFactory2 } from '@angular/core';
import { CommonService } from 'src/app/canvas/services/common.service';
import { TemplateService } from 'src/app/canvas/services/template.service';

@Injectable({
  providedIn: 'root'
})
export class BoxMenuService {
  public tempFrameValue = this.templateService.tempFrameValue;
  private renderer: Renderer2;
  public rowHTML = '';

  public noOfGrids = 12;
  public columnSplits = [];

  constructor(private commonService: CommonService,
    private templateService: TemplateService,
    private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this._setColumnSplitValues();
  }

  /*
    Set the column grid values according to grid css class count.
    for 12 grid layout if 3 column div is available colclass value should be 4 for each div and so on.
    noOfGrids var defines grid values, here its 12 grid, if 18 grid layout is introduced we need to pass 18 to this variable.
  */
  _setColumnSplitValues() {
    for (let grid = 1; grid <= this.noOfGrids; grid++) {
      let quotient = this.noOfGrids / grid;
      let remainder = this.noOfGrids % grid;
      let columnSplitValue = [];
      for (let i = 0; i < grid; i++) {
        if (i < remainder)
          columnSplitValue.push(Math.ceil(quotient));
        else
          columnSplitValue.push(Math.floor(quotient));
      }
      this.columnSplits.push(columnSplitValue);
    }
  }

  /**
  * Split row / Add row functionality.
  * @param {*} element - nodeElements to be passed   
  */
  _splitRow(element: any) {
    let rowElement: any;
    let rowDiv: any;
    let rowDiv1: any;
    let rowDiv2: any;
    let rowHTML: any = '';

    if (element.getAttribute("ark-data") == 'container') {
      return false;
    }

    if (element.getAttribute("ark-data") == 'column') {
      if (element.className.match(/oa-c-lg-12/g) != null) {
        rowElement = element.parentElement;
        rowDiv = this._createRow('');

        this.templateService._setFrameObj(rowDiv);

        rowElement.insertAdjacentElement("afterEnd", rowDiv);
      }
      else {
        rowElement = element;
        element.querySelectorAll("[ark-data]")
        this.renderer.removeClass(rowElement, 'dropHereFirst');
        this.renderer.removeClass(rowElement, 'oa-pt15');
        this.renderer.removeClass(rowElement, 'oa-pb15');

        if (rowElement.querySelector("[ark-data]") != null) {
          rowHTML = rowElement.querySelector("[ark-data]").outerHTML;
          rowElement.querySelector("[ark-data]").outerHTML = '';
        }

        rowDiv1 = this._createRow(rowHTML);
        rowDiv2 = this._createRow('');

        this.templateService._setFrameObj(rowDiv1);
        this.templateService._setFrameObj(rowDiv2);

        rowElement.insertAdjacentElement("afterBegin", rowDiv2);
        rowElement.insertAdjacentElement("afterBegin", rowDiv1);
      }
    }
    else {
      rowElement = element;
      rowDiv = this._createRow('');

      this.templateService._setFrameObj(rowDiv);

      rowElement.insertAdjacentElement("afterEnd", rowDiv);
    }

    this.templateService._disableActiveBox();
  }


  /**
   * Split column / Add column functionality.
   * @param {*} element - nodeElements to be passed   
   */
  _splitColumn(element: any) {
    let parentRow: any;
    let colClassName = 'oa-c-lg-';
    let self = this;
    if (element.getAttribute("ark-data") == 'container') {
      return false;
    }

    if (element.getAttribute("ark-data") == 'column') {
      parentRow = element.parentElement;
    }
    else {
      parentRow = element;
    }

    let colData = { class: ['oa-c-md-12', 'oa-c-sm-12', 'oa-c-xs-12', 'dropHereFirst', 'oa-pt15', 'oa-pb15', 'oa-pl15', 'oa-pr15', 'oa-txt-center'], id: 'column', attr: [['ark-data', 'column']] };
    let colDiv = this.commonService._createDynamicElement('div', colData, '');
    let columnCount = parentRow.children.length;
    this.templateService._setFrameObj(colDiv);

    if ((columnCount + 1) <= 12) {
      element.insertAdjacentElement('afterEnd', colDiv)
      //parentRow.insertAdjacentElement('beforeEnd', colDiv);

      columnCount = parentRow.children.length;

      let columnDiv: Array<HTMLElement> = [];
      columnDiv = parentRow.children;
      Array.prototype.slice.call(columnDiv).map(function (currentValue, index, arr) {
        currentValue.className = currentValue.className.replace(/oa-c-lg-\d+/g, "");

        let colClsName = colClassName + self.columnSplits[columnCount - 1][index];

        self.renderer.addClass(currentValue, colClsName);
      });
    }

    this.templateService._disableActiveBox();
  }

  /**
  * Creating new row with adding default classes which comes from API.
  * @param {*} HTMLElement - html text to be passed   
  */
  _createRow(rowHTML: any) {
    let rowData = { class: ['oa-row','no-gutters'], id: 'row', attr: [['ark-data', 'row']] };
    let rowDiv = this.commonService._createDynamicElement('div', rowData, '');

    let colClassName = 'oa-c-lg-12';
    let colData: any;
    let colDiv: any;
    if (rowHTML == '') {
      colData = { class: [colClassName, 'oa-c-md-12', 'oa-c-sm-12', 'oa-c-xs-12', 'dropHereFirst', 'oa-pt15', 'oa-pb15', 'oa-pl15', 'oa-pr15', 'oa-txt-center'], id: 'column', attr: [['ark-data', 'column']] };
      colDiv = this.commonService._createDynamicElement('div', colData, '');
    }
    else {
      let doc = new DOMParser().parseFromString(rowHTML, 'text/html');
      colData = { class: [colClassName, 'oa-c-md-12', 'oa-c-sm-12', 'oa-c-xs-12', 'oa-pt15', 'oa-pb15', 'oa-pl15', 'oa-pr15', 'oa-txt-center'], id: 'column', attr: [['ark-data', 'column']] };
      colDiv = this.commonService._createDynamicElement('div', colData, '');
      colDiv.appendChild(doc.body.firstChild);
    }

    this.renderer.appendChild(rowDiv, colDiv);

    return rowDiv;
  }

  /**
   * Delete the selected Row / Column
   * @param {*} element - nodeElements to be passed   
   */
  _deleteSelected(element: any) {
    let parentRow: any;
    let colClassName = 'oa-c-lg-';
    let self = this;
    let columnCount: any;
    let parentContainer = self.commonService._getElementParent(element, "[ark-data=container]");
    let parentSection = self.commonService._getElementParent(element, "[ark-data=section]");
    
    if (element.getAttribute("ark-data") == 'column') {
      parentRow = element.parentElement;
      this.templateService._setFrameObj(parentRow);

      if (element.parentNode.querySelectorAll("[ark-data=column]").length == 1) {
        if (parentContainer.querySelectorAll("[ark-data=row]").length == 1) {
          if (confirm("Selected Frame has only one Row, Deleting will remove whole Frame, Are You Sure?")) {
            parentSection.parentElement.removeChild(parentSection);
          }
        }

        if (parentContainer.querySelectorAll("[ark-data=row]").length > 1) {
          if(parentRow.parentNode.getAttribute("ark-data") == 'column'){
            parentRow.parentNode.removeChild(element.parentNode);   
          }
          else{
            parentContainer.removeChild(element.parentNode);
          }          
        }
      }

      if (element.parentNode.querySelectorAll("[ark-data=column]").length > 1) {
        element.parentNode.removeChild(element.childNodes[0].parentNode);
      }

      columnCount = parentRow.children.length;
      /**
       * Recalculate column count according to grid layout after deleting column.
      */
      let columnDiv: Array<HTMLElement> = [];
      columnDiv = parentRow.children;
      Array.prototype.slice.call(columnDiv).map(function (currentValue, index, arr) {
        currentValue.className = currentValue.className.replace(/oa-c-lg-\d+/g, "");
        let colClsName = colClassName + self.columnSplits[columnCount - 1][index];

        self.renderer.addClass(currentValue, colClsName);
      });
    }
    else if (element.getAttribute("ark-data") == 'row') {
      parentRow = element;
      this.templateService._setFrameObj(parentRow);

      if (parentContainer.querySelectorAll("[ark-data=row]").length == 1) {
        if (confirm("Selected Frame has only one Row, Deleting will remove whole Frame, Are You Sure?")) {
          parentSection.parentElement.removeChild(parentSection);
        }
      }

      if (parentContainer.querySelectorAll("[ark-data=row]").length > 1) {
        parentRow.parentNode.removeChild(parentRow.childNodes[0].parentNode);
      }
    }
    else {
      parentSection.parentNode.removeChild(parentSection.childNodes[0].parentNode);
    }

    if(parentContainer != undefined){
      Array.prototype.slice.call(parentContainer.querySelectorAll("[ark-data=column]")).map(function (currentValue, index, arr) {
        if(currentValue.innerHTML == ''){
          self.renderer.addClass(currentValue, 'dropHereFirst');
        }
      });
    }    

    this.templateService._disableActiveBox();
  }
}
