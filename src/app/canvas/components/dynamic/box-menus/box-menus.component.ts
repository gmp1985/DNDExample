import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { BoxMenuService } from 'src/app/canvas/services/box-menu.service';
import { CommonService } from 'src/app/canvas/services/common.service';
import { TemplateService } from 'src/app/canvas/services/template.service';
import { AdvancedMenuComponent } from '../editor-menus/menus.component';

@Component({
  selector: 'ark-box-menus',
  templateUrl: './box-menus.component.html',
  styleUrls: ['./box-menus.component.css']
})
export class BoxMenusComponent implements OnInit {

  public menuFlag = true;
  public eleList: any;
  public boxmenuList: any;
  @Input() data: any;
  @ViewChild("loadMenu") loadMenu: ElementRef;
  public tempFrameValue = this.templateService.tempFrameValue;

  constructor(private boxMenuService: BoxMenuService,
    private commonService: CommonService,
    private templateService: TemplateService,
    private renderer: Renderer2) {
    this.eleList = this.templateService.elementList;
  }

  ngOnInit() {   
    let eleAttr = this.data.ele.getAttribute("ark-data"); 
    if(this.data.ele.className.match(/oa-c-lg-12/g) != null){
      eleAttr = 'column12'; 
    }
    this.boxmenuList = this.templateService.boxMenuList[eleAttr];      
  }

  triggerAction(mode: any) {
    switch (mode) {
      case 'selectParent':
        this._selectParentElement(this.commonService.selectedBoxMenu);
        break;
      case 'splitRow':
        this.boxMenuService._splitRow(this.commonService.selectedBoxMenu);
        break;
      case 'splitColumn':
        this.boxMenuService._splitColumn(this.commonService.selectedBoxMenu);
        break;
      case 'delete':
        this.boxMenuService._deleteSelected(this.commonService.selectedBoxMenu);
        break; 
      case 'settings':
        this._showSettings(this.commonService.selectedBoxMenu);
        break;
      default:
        break;
    }
  }
  
  _selectParentElement(element: any) {
    if (element.parentElement.getAttribute("ark-data") != 'section') {
      this.templateService._disableActiveBox();

      if (this.tempFrameValue.querySelectorAll('*[id^="boxMenu"]').length == 0) {
        const data = { ele: element.parentNode };
        const options = { insertMode: 'afterend', element: element, class: '' };

        this.commonService.selectedBoxMenu = element.parentNode;

        const elementData = { class: ['boxIconDIv', 'material-icons'], id: 'boxIcon', attr: '' };
        const boxIconDiv = this.commonService._createDynamicElement('div', elementData, 'more_horiz');
        element.parentElement.insertAdjacentElement("afterbegin", boxIconDiv);
        
        this.commonService.boxCompRef = this.commonService._createDynamicComponent(BoxMenusComponent, data, options);
        let eleAttrData = boxIconDiv.parentNode.getAttribute("ark-data");        

        const boxLblData = { class: ['arkAppActiveBoxLabel'], id: 'arkActiveBoxLabel', attr: '' };
        const boxLblDiv = this.commonService._createDynamicElement('div', boxLblData, this.templateService.boxMenuList[eleAttrData]["displayValue"]);              
        boxIconDiv.parentNode.insertAdjacentElement("afterbegin", boxLblDiv);        

        //Finding parent container node of selected.
        let parentContainer = this.commonService._getElementParent(element, "[ark-data=container]");
        this.renderer.addClass(parentContainer, "arkAppActiveComp");

        //Finding parent container node of selected.
        let rowParent = this.commonService._getElementParent(element, "[ark-data=row]");
        if (rowParent != undefined) {
          this.renderer.addClass(rowParent, "arkAppActiveRow");
        }

        this.renderer.addClass(element.parentElement, 'arkAppActiveBox');

        //Creating overlay div when any box is active
        this.templateService._createOverlayDiv();
      }
    }
  }

  _showSettings(element: any){
    const data = { ele: element };
    const options = { insertMode: 'appendChild', element: '', class: 'ark-advance-menu' };    
    if(this.commonService.boxSettingsRef != undefined){
      this.commonService.boxSettingsRef.destroy();
    }    

    this.commonService.boxSettingsRef = this.commonService._createDynamicComponent(AdvancedMenuComponent, data, options);    
  }
}
