import { Component, Input, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/canvas/services/common.service';
import { EditorMenusService, QuickMenu } from 'src/app/canvas/services/editor-menus.service';
import { SliderConfig } from '../slider/SliderConfig';
import { TemplateService } from 'src/app/canvas/services/template.service';


// Editor quick menu
@Component({
  selector: 'editor-quick-menu',
  template: `<div class="editor-quick-menu" [style.top.px]="top" [style.left.px]="left">
                <ul>
                  <li *ngFor="let quickMenu of quickMenus;" [ngSwitch]="quickMenu.iconType">

                  <a *ngSwitchCase="'button'" (click)="execCommand(quickMenu, $event)">
                    <i class="{{quickMenu.iconClass}}"></i>
                  </a>

                  <div *ngSwitchCase="'select'" class="selectdiv" >
                    <label class="dropdown">
                      <div class="dd-button">{{this.selectedHeader}}</div>
                      <input type="checkbox" class="dd-input">
                      <ul class="dd-menu">
                        <li *ngFor="let option of quickMenu.source;" (click)="selectDropDown(quickMenu, $event);" [attr.data-value]=option.value >{{option.name}}</li>
                      </ul>
                    </label>
                  </div>

                  <a *ngSwitchCase="'hyperlink'" (click)="execHyperlinkCommand(quickMenu, $event)" [ngClass]="hyperlinkStatus ? 'arw' : ''">
                    <i class="{{quickMenu.iconClass}}"></i>
                  </a>

                  <span *ngSwitchDefault></span>
                  </li>
                </ul>
                <div class="dotted-right"><i class="material-icons" (click)="showAdvancedSettings($event)"> more_horiz </i></div>
              </div>`,
  styleUrls: ['./menus.component.css']
})
export class QuickMenuComponent implements OnInit {
  @Input() data: any;
  activeElement: any;
  quickMenus: QuickMenu;
  top: number;
  left: number;
  grouppedIcons: any;
  selectedHeader: string;
  hyperlinkStatus = false;

  constructor(private editorMenusService: EditorMenusService, private templateService: TemplateService) { }

  ngOnInit() {
    this.top = this.data.topPosition;
    this.left = this.data.leftPosition; 
    const clintRec = this.data.activeElement.getClientRects()[0];     
    this.activeElement = this.data.activeElement;
    this.quickMenus = this.data.options.QuickMenu;
    if (this.activeElement.getAttribute('ark-data') === 'heading') {
      this.selectedHeader = this.activeElement.firstElementChild.tagName;
    }
  }

  /**
   * Function to execute commands on elements
   *
   * @param {QuickMenu} quickMenu
   * @memberof QuickMenuComponent
   */
  execCommand(quickMenu: QuickMenu, event: MouseEvent) {    
    this.grouppedIcons = Object.values(this.quickMenus).filter(element => element.iconGroup === quickMenu.iconGroup);
    this.editorMenusService._executeCommand(quickMenu, this.activeElement, event.target, this.grouppedIcons);
  }

  selectDropDown(quickMenu: QuickMenu, event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    target.closest('.dropdown').children[0].innerHTML = target.innerHTML;
    this.execCommand(quickMenu, event);
  }

  execHyperlinkCommand(quickMenu: QuickMenu, event: MouseEvent) {
    this.hyperlinkStatus = !this.hyperlinkStatus;
  }

  showAdvancedSettings(event: any) {

  }
}

// Advanced Menu
@Component({
  selector: 'advanced-menu',
  template: `	<div class="Ark-editor">
                <div class="settings-head">
                  <div class="title"><span>Settings</span></div>
                  <div class="close-btn"><i class="material-icons bg f-icon" (click)=this.closeAdvMenu()>close</i></div>
                </div>
                <div class="sb">
                <!--<div class="sec-bg">
                  <div class="title">{{this.data.ele.getAttribute("ark-data") | titlecase}} Class</div>
                  <div class="input-comp"><input #boxClass type="text" name="boxClass" value="{{this.data.ele.className}}" class="txt-box" id="boxClass" autocomplete="off" (keyup.enter)="onEnter(boxClass.value)"></div>
                </div>-->
                <div class="sec-bg">
                  <div class="title">Background Image <i class="mt-icon-12 settingIcn"></i></div>
                  <div class="txt-comp">                  
                  <span (click)='handleClick(this)'>
                    <i class="mt-icon-15"></i>
                    <div>
                      <input type='file' name='fileInput' id="fileInput" style='display:none;' (change)='handleFileInput($event.target.files, $event)'/>
                    </div>
                  </span>
                  </div>                  
                </div>
                <div class="sec-bg">
                <div class="title">Background Image Settings</div>
                <div class="f-comp">
                <div class="paddings inpSec">
                  <div class="title" style="padding-top: 3px; padding-bottom: 0px;">URL : </div>
                  <div style="padding-left: 10px; float: left;"><input #imgURL type="text" class="inpCls" name="imgURL" value="0" id="imgURL" (keyup.enter)="onInputEnter(imgURL.value, 'bgURL')"></div>
                </div>
                <div class="paddings inpSec">
                  <div class="title" style="padding-top: 3px; padding-bottom: 0px;">Height : </div>
                  <div style="padding-left: 10px; float: left;"><input #inpHieght type="text" class="inpCls" name="inpHieght" value="0" id="inpHieght" (keyup.enter)="onInputEnter(inpHieght.value, 'height')"></div>
                </div>
                <div class="paddings inpSec">
                  <div class="title" style="padding-top: 3px; padding-bottom: 0px;">Background size : </div>
                  <div style="padding-left: 10px; float: left;">
                  <input #bgsize type="text" class="inpCls" name="bgsize" value="0" id="inpHieght" (keyup.enter)="onInputEnter(bgsize.value, 'bgsize')">
                  </div>
                </div>
                <div class="paddings inpSec">
                  <div class="title" style="padding-top: 3px; padding-bottom: 0px;">Background Position : </div>
                  <div style="padding-left: 10px; float: left;">
                    <select class="inpCls">
                      <option>Top</option>
                      <option>Right</option>
                      <option>Bottom</option>
                      <option>left</option>
                    </select>
                  </div>
                </div>
                <div class="paddings inpSec">
                  <div class="title" style="padding-top: 3px; padding-bottom: 0px;">Background Repeat : </div>
                  <div style="padding-left: 10px; float: left;">
                  <select class="inpCls">
                    <option>Repeat</option>
                    <option>No-Repeat</option>                    
                  </select>
                  </div>
                </div>
              </div>
              </div>
                  <div class="sec-bg">
                    <div class="title">Padding</div>
                    <div class="f-comp">
                    <div class="paddings">
                    <div *ngFor="let padding of paddingConfig; let i = index;" [className]="padding.property">
                        <ark-slider [config]="padding.config" [value]="padding.value"
                                    (valueChange)="setSliderValue($event, padding.property)"></ark-slider>
                    </div>
                  </div>
                  </div>
                  </div>
                  <div class="sec-bg">
                    <div class="title">Margin</div>
                    <div class="f-comp">
                    <div class="paddings">
                    <div *ngFor="let margin of marginConfig; let i = index;" [className]="margin.property">
                        <ark-slider [config]="margin.config" [value]="margin.value"
                                    (valueChange)="setSliderValue($event, margin.property)"></ark-slider>
                    </div>
                  </div>
                  </div>
                  </div>
                  <div class="sec-bg">
                    <div class="title">Background Color</div>
                    <div class="txt-comp">
                      <ark-color [(colorCode)]="color" [selType]="backgroundColor"></ark-color>
                    </div>
                  </div>
                  <div class="sec-bg">
                    <div class="title">Text color</div>
                    <div class="txt-comp">
                      <ark-color [(colorCode)]="defTextColor" [selType]="textColor"></ark-color>
                    </div>
		              </div>                  
                </div>
                <div class="settings-btm"></div>
              </div>`,
  styleUrls: ['./menus.component.css']
})
export class AdvancedMenuComponent implements OnInit {
  @Input() data: any;
  color = '#FFFFFF';  
  defTextColor = '#FFFFFF';
  backgroundColor = 'background-color';
  textColor = 'text-color';
  public advanceMenuList: any;

  @ViewChild('test') testElement: ElementRef<HTMLDivElement>;
  @Output() fileHandler: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('paddings') paddingElements: QueryList<ElementRef>;

  private val: number = 14;
  private top: number = 0;
  private left: number = 0;
  private right: number = 0;
  private bottom: number = 0;


  paddingConfig: Array<{ property: string, config: SliderConfig, value: number }> = [
      {
        property: 'padding-top',
        config: {minValue: 0, maxValue: 95, label: 'Top', stepCount: 5},
        value: this.top
      },
      {
          property: 'padding-bottom',
          config: {minValue: 0, maxValue: 95, label: 'Bottom', stepCount: 5},
          value: this.bottom
      },
      {
        property: 'padding-left',
        config: {minValue: 0, maxValue: 95, label: 'Left', stepCount: 5},
        value: this.left
      },
      {
          property: 'padding-right',
          config: {minValue: 0, maxValue: 95, label: 'Right', stepCount: 5},
          value: this.right
      },
  ];

  marginConfig: Array<{ property: string, config: SliderConfig, value: number }> = [
    {
      property: 'margin-top',
      config: {minValue: 0, maxValue: 95, label: 'Top', stepCount: 5},
      value: this.top
    },
    {
        property: 'margin-bottom',
        config: {minValue: 0, maxValue: 95, label: 'Bottom', stepCount: 5},
        value: this.bottom
    }/*,
    {
      property: 'margin-left',
      config: {minValue: 0, maxValue: 95, label: 'Left', stepCount: 5},
      value: this.left
    },
    {
        property: 'margin-right',
        config: {minValue: 0, maxValue: 95, label: 'Right', stepCount: 5},
        value: this.right
    },*/
  ];

  constructor(
    private commonService: CommonService,
    private templateService: TemplateService,
    private editorMenusService: EditorMenusService,
    private renderer: Renderer2) { }

  ngOnInit() {
    let self = this;
    this.templateService.selectedElement = this.data.ele;

    let eleAttr = this.data.ele.getAttribute("ark-data"); 
    if(this.data.ele.className.match(/oa-c-lg-12/g) != null){
      eleAttr = 'column12'; 
    }
    this.advanceMenuList = this.templateService.boxMenuList[eleAttr]["AdvancedMenu"];   
    console.log(this.advanceMenuList); 

    Array.prototype.slice.call(this.data.ele.classList).map(function (currentValue, index, arr) {
      let pValue;
      if(currentValue.match(/oa-pt\d+/g)){
        pValue = currentValue.split(/oa-pt/g);
        self.paddingConfig[0].value = pValue[1];
      }

      if(currentValue.match(/oa-pb\d+/g)){
        pValue = currentValue.split(/oa-pb/g);
        self.paddingConfig[1].value = pValue[1];
      }

      if(currentValue.match(/oa-pl\d+/g)){
        pValue = currentValue.split(/oa-pl/g);
        self.paddingConfig[2].value = pValue[1];
      }

      if(currentValue.match(/oa-pr\d+/g)){
        pValue = currentValue.split(/oa-pr/g);
        self.paddingConfig[3].value = pValue[1];
      }
    });

    Array.prototype.slice.call(this.data.ele.classList).map(function (currentValue, index, arr) {
      let mValue;
      if(currentValue.match(/oa-mt\d+/g)){
        mValue = currentValue.split(/oa-mt/g);
        self.marginConfig[0].value = mValue[1];
      }

      if(currentValue.match(/oa-mb\d+/g)){
        mValue = currentValue.split(/oa-mb/g);
        self.marginConfig[1].value = mValue[1];
      }

      if(currentValue.match(/oa-ml\d+/g)){
        mValue = currentValue.split(/oa-ml/g);
        self.marginConfig[2].value = mValue[1];
      }

      if(currentValue.match(/oa-mr\d+/g)){
        mValue = currentValue.split(/oa-mr/g);
        self.marginConfig[3].value = mValue[1];
      }
    });
  }

  onEnter(value: string) { this.data.ele.className = value; }

  onInputEnter(value: string, status: string){ 
    console.log(value, this.data.ele); 
    switch(status){
      case 'bgURL':
        this.renderer.setStyle(this.data.ele,"background-image","url("+value+")");
        this.renderer.setStyle(this.data.ele,"background-position","top");  
        this.renderer.setStyle(this.data.ele,"background-size","cover");
        this.renderer.setStyle(this.data.ele,"background-repeat","no-repeat");
      break;
      case 'height':
        this.renderer.setStyle(this.data.ele,"height",value);
      break;
      case 'bgrepeat':
      
      break;
      case 'bgposition':
      
      break;
    }

  }

  closeAdvMenu() {
    this.commonService.boxSettingsRef.destroy();
  }

  handleClick(el: any){
    //this._elementRef.nativeElement.querySelector('input').click();
    document.getElementById("fileInput").click();
  }

  handleFileInput(file, e){
    let self = this;
    this.toBase64(file[0]).then((result) => {
      this.commonService.isBrowseClicked = false;
      this.fileHandler.emit({image: result});      
      self.renderer.setStyle(this.templateService.selectedElement,"background-image","url("+result+")");
      self.renderer.setStyle(this.templateService.selectedElement,"background-repeat","no-repeat");
      self.renderer.setStyle(this.templateService.selectedElement,"background-size","cover");
      
      self.renderer.addClass(this.templateService.selectedElement, "oa-xs-bgImage");
      self.renderer.addClass(this.templateService.selectedElement, "oa-md-bgImage");
    });
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  private setSliderValue(value: number, property: string) {
    let classVal: any;
    let classExist: any;
    switch(property){
      case 'padding-left':
        classVal = 'oa-pl';
        classExist = this.data.ele.className.match(/oa-pl\d+/g);
      break;
      case 'padding-right':
        classVal = 'oa-pr';
        classExist = this.data.ele.className.match(/oa-pr\d+/g);
      break;
      case 'padding-top':
        classVal = 'oa-pt';
        classExist = this.data.ele.className.match(/oa-pt\d+/g);
      break;
      case 'padding-bottom':
        classVal = 'oa-pb';
        classExist = this.data.ele.className.match(/oa-pb\d+/g);
      break;
      case 'margin-left':
        classVal = 'oa-ml';
        classExist = this.data.ele.className.match(/oa-ml\d+/g);
      break;
      case 'margin-right':
        classVal = 'oa-mr';
        classExist = this.data.ele.className.match(/oa-mr\d+/g);
      break;
      case 'margin-top':
        classVal = 'oa-mt';
        classExist = this.data.ele.className.match(/oa-mt\d+/g);
      break;
      case 'margin-bottom':
        classVal = 'oa-mb';
        classExist = this.data.ele.className.match(/oa-mb\d+/g);
      break;
    }

    if(classExist != null){
      this.renderer.removeClass(this.data.ele, classExist[0]);
    }

    this.renderer.addClass(this.data.ele, classVal+ value);
  }
}
