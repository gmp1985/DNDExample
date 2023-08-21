import { Component, OnInit, OnChanges, DoCheck, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { TemplateService } from './../../services/template.service';
import { CommonService } from './../../services/common.service';
import { EditorMenusService } from './../../services/editor-menus.service';
@Component({
  selector: 'ark-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css']
})
export class DynamicComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


// ruler line component
@Component({
  selector: '.rulerline',
  template: `<span rulerline [Left]="data.Left" [attr.data-id]="data.Id" [attr.data-locked]="data.Locked"></span>`,
  styleUrls: ['./dynamic.component.css']
})
export class RulerLineComponent implements OnInit {
  @Input() data;
  constructor() { }
  ngOnInit() { }
}


// ruler guide info
@Component({
  // tslint:disable-next-line:component-selector
  selector: '.rulerguideinfo',
  template: `<span class="guide-info" [ngClass]="{'alignLeft': alignLeft}">{{_getGuideInfo()}}</span>`,
  styleUrls: ['./dynamic.component.css']
})
export class RulerGuideInfoComponent implements OnInit {
  @Input() data;
  InfoValue = '';
  alignLeft = false;
  constructor(
    private templateservice: TemplateService,
    private commonservice: CommonService
  ) {


  }


  _getGuideInfo() {
    this.templateservice._getGuideInfo().subscribe((data) => {
      this.InfoValue = data + 'px';
      (data + ((this.commonservice._getScreenWidth() - this.templateservice._getTemplateWidth()) / 2) > this.commonservice._getScreenWidth() - 100) ? this.alignLeft = true : this.alignLeft = false;
    });
    return this.InfoValue;
  }

  ngOnInit() { }
}

// ruler guide menu
@Component({
  // tslint:disable-next-line:component-selector
  selector: '.rulerguidemenu',
  template: `<span class="guide-menu" [style.top.px]=Top>
                <div class="editIcon" id="div1">
                	<div class="f-icon-box">
                		<div class="f-icon"><i class="mt-icon-30" (click)="lockunlockGridline($event)"></i></div>
                		<div class="f-icon"><i class="mt-icon-32" (click)="deleteGrideline($event)"></i></div>
                	</div>
                </div>
              </span>{{Left}}`,
  styleUrls: ['./dynamic.component.css']
})
export class RulerGuideMenuComponent implements OnInit {
  @Input() data;
  Left: number;
  Top: number;
  isLocked: boolean;
  constructor(
    private templateservice: TemplateService
  ) { }
  ngOnInit() {
    this.Left = this.data.Left;
    this.Top = this.data.Top;
  }
  lockunlockGridline(e) {
    const id = this.data.Guide[0].Id;
    const index = this.templateservice.guideLines.map((guide, index) => { if (guide.Id === id) { return index; } }).filter(i => i !== undefined)[0];
    this.templateservice.guideLines[index].Locked = !this.data.Guide[0].Locked;
    this.isLocked = this.data.Guide[0].Locked;
  }

  deleteGrideline(e) {
    const id = this.data.Guide[0].Id;
    const index = this.templateservice.guideLines.map((guide, index) => { if (guide.Id === id) { return index; } }).filter(i => i !== undefined)[0];
    this.data.Guide[0].Ref.destroy();
    this.templateservice.guideLines.splice(index, 1);

  }
}

// Element Drop Zone
@Component({
  selector: 'ark-element-drop-zone',
  template: `<div id="dropElement" class="arkAppDropeleZone arkAppMakeBlock" arkDroppable></div>`,
  styleUrls: ['./dynamic.component.css']
})
export class ElementDropZoneComponent implements OnInit {
  @Input() data;
  constructor() { }
  ngOnInit() { }
}

// Component Drop Zone
@Component({
  selector: 'ark-component-drop-zone',
  template: `<div id="dropSection" class="arkAppSecDropZone arkAppMakeBlock" arkDroppable></div>`,
  styleUrls: ['./dynamic.component.css']
})
export class ComponentDropZoneComponent implements OnInit {
  @Input() data;
  constructor() { }
  ngOnInit() { }
}

// Image Drop Zone
@Component({
  selector: '.ark-image',
  template: `<div #imageWrapper class="arkImagedragdrop focused oa-xs-img-fluid" [imagewrapper]=imageWrapper style='width:100%' [style.height.px]=imageplaceholderHeight  (dropHandler)="onDropHandler($event)" ark-data="image">

                <span *ngIf=!imageSRC class='content' [style.fontSize.px]=imageplaceholderFontSize>
                    <span class='icon'><span class="mt-icon-33"></span></span>
                    <span class='dimention'>{{imageplaceholderWidth}} x {{imageplaceholderHeight}}</span>
                </span>
                <img *ngIf=isImageloaded src={{imageSRC}} [style.width.px]=imageWidth [style.height.px]=imageHeight class="oa-xs-img-fluid"/>
                </div>`,
  styleUrls: ['./dynamic.component.css']
})
export class ImageElement implements OnInit, DoCheck {
  @Input() data;
  @ViewChild('imageWrapper') imageWrapper: ElementRef;

  public imageplaceholderWidth: number;
  public imageplaceholderHeight: number;
  public imageplaceholderFontSize: number;
  public imageWidth: number;
  public imageHeight: number;
  public imageSRC: string;
  public isImageloaded: boolean;
  public newSize: object;

  constructor(private commonservice: CommonService) { }
  ngOnInit() {
    this.isImageloaded = false;
    this.imageplaceholderWidth = Math.round(this.data.width);
    this.imageplaceholderHeight = Math.round(this.data.height);
    this.imageplaceholderFontSize = (this.imageplaceholderWidth <= this.imageplaceholderHeight) ? Math.round(this.imageplaceholderWidth * 12 / 100) : Math.round(this.imageplaceholderHeight * 12 / 100);
  }

  ngDoCheck() {

    if ((this.imageWrapper.nativeElement.offsetWidth !== this.imageplaceholderWidth) || (this.imageWrapper.nativeElement.classList.contains('activeEdtrElement') && this.commonservice.filebrowse !== '')) {
      
      this.imageSRC = this.commonservice.filebrowse !== '' ? this.commonservice.filebrowse : this.imageSRC ;
      this.commonservice.filebrowse = '';
      this.imageplaceholderWidth = this.imageWrapper.nativeElement.offsetWidth;
      // this.imageplaceholderHeight = this.imageWrapper.nativeElement.offsetHeight > 0 ? this.imageWrapper.nativeElement.offsetHeight : this.imageplaceholderHeight;
      this.imageplaceholderHeight = Math.round((this.imageplaceholderWidth > 500) ? this.imageplaceholderWidth * 50 / 100 : this.imageplaceholderWidth);
      this.imageplaceholderFontSize = (this.imageplaceholderWidth <= this.imageplaceholderHeight) ? Math.round(this.imageplaceholderWidth * 12 / 100) : Math.round(this.imageplaceholderHeight * 12 / 100);
      if (typeof (this.imageSRC) !== 'undefined') {
        this.imageWrapper.nativeElement.classList.remove('activeEdtrElement', 'focused');
        const data = { image: this.imageSRC, width: this.imageplaceholderWidth, height: this.imageplaceholderHeight };
        this.commonservice._getResizedImageSize(data).then((result) => {
          if (Object.keys(result).length > 0) {
            // tslint:disable-next-line:no-string-literal
            this.imageWidth = result['width'];
            // tslint:disable-next-line:no-string-literal
            this.imageHeight = result['height'];
            if (this.imageHeight <= this.imageplaceholderHeight) {
              this.imageplaceholderHeight = this.imageHeight;
            }
            this.isImageloaded =true;
          }
        });
      }
    }
  }

  onDropHandler(object) {
    this.imageSRC = object.event.target.result;
    const data = { image: this.imageSRC, width: this.imageplaceholderWidth, height: this.imageplaceholderHeight };
    this.commonservice._getResizedImageSize(data).then((result) => {
      if (Object.keys(result).length > 0) {
        // tslint:disable-next-line:no-string-literal
        this.imageWidth = result['width'];
        // tslint:disable-next-line:no-string-literal
        this.imageHeight = result['height'];
        if (this.imageHeight <= this.imageplaceholderHeight) {
          this.imageplaceholderHeight = this.imageHeight;
        }
        this.isImageloaded = true;
      }
    });
  }

}


// editor quick menu
@Component({
  selector: '.ark-editorquickmenu',
  template: `<div class="header">
  <ul>
    <li *ngFor="let quickMenu of quickMenus;">
      <quickmenuIcon [Options]=quickMenu [data]=data (fileHandler)="onfileHandler($event)"></quickmenuIcon>
    </li>
  </ul>
  <div class="dotted-right" (click)="_openAdvanceSettings()"><i class="material-icons mt-icon-09"></i></div>
</div>`,
  styleUrls: ['./dynamic.component.css']
})
export class EditorquickMenu implements OnInit {
  @Input() data;
  public quickMenus;
  constructor(
    private viewContainerRef: ViewContainerRef,
    private _templateService: TemplateService,
    private _commonService: CommonService,
    private _editorMenusService: EditorMenusService
  ) { }
  ngOnInit() {
    this.quickMenus = this.data.options.QuickMenu;
  }

  _openAdvanceSettings() {
    this._templateService.advanceMenuRef = this._commonService._createDynamicComponent(EditoradvanceMenu, this.data, '');
    document.querySelector('.ark-advance-menu').prepend(this._templateService.advanceMenuRef.location.nativeElement);

    this.viewContainerRef
      .element
      .nativeElement
      .parentElement
      .removeChild(this.viewContainerRef.element.nativeElement);
  }

  onfileHandler(data) {
    this._commonService.filebrowse = data.image;
  }

}


// editor advance menu
@Component({
  selector: '.ark-advancemenu',
  template: `<div class="Ark-editor">
  <div class="settings-head">
    <div class="title"><span>Settings</span></div>
    <div class="close-btn"><i class="material-icons bg f-icon" (click)=this._closeAdvMenu()>close</i></div>
  </div>
  <div class="sb">
    <div class="sec-bg">
    <div class="title">Quick options</div>
    <div class="txt-comp">
      <ul class="quickmenu">
      <li *ngFor="let quickMenu of quickMenus;">
        <quickmenuIcon [Options]=quickMenu [data]=data (fileHandler)="onfileHandler($event)"></quickmenuIcon>
      </li>
      </ul>
    </div>
    </div>
    <div class="sec-bg">
    <div class="title">Size</div>
    <div class="input-comp">
      <input type="text" name="" value="" class="txt-box" id="searchbox" autocomplete="off" placeholder="Width">
      <span id="clear">
      <i class="material-icons bg f-icon">close</i>
      </span>
    </div>
    <div class="input-comp">
      <input type="text" name="" value="" class="txt-box" id="searchbox" autocomplete="off" placeholder="Height">
      <span id="clear">
      <i class="material-icons bg f-icon">close</i>
      </span>
    </div>
    </div>
  </div>
  <div class="settings-btm"></div>
  </div>`,
  styleUrls: ['./dynamic.component.css']
})
export class EditoradvanceMenu implements OnInit {
  @Input() data;
  public quickMenus;
  constructor(
    private _commonService: CommonService,
    private _templateService: TemplateService
  ) { }
  ngOnInit() {
    this.quickMenus = this.data.options.QuickMenu;
  }

  _closeAdvMenu() {
    this._commonService._destroyDynamicComponent(this._templateService.advanceMenuRef);
  }
  onfileHandler(data) {
    this._commonService.filebrowse = data.image;
  }
}


@Component({
  selector: 'quickmenuIcon',
  template: ` <span (click)='handleClick(Options["icon"]);'>
                <i [ngClass]="Options['iconFont']"></i>
                <div *ngIf="Options['isbrowse']">
                  <input type='file' name='fileInput' style='display:none;' (change)='handleFileInput($event.target.files, $event)'/>
                </div>
              </span>`,
  styleUrls: ['./dynamic.component.css']
})
export class QuickMenuIcon implements OnInit {
  @Input() Options: object;
  @Input() data: object;
  @Output() fileHandler: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private _elementRef : ElementRef,
    private _commonService: CommonService,
    private _templateService: TemplateService,
    private _editorMenusService: EditorMenusService
  ) { }

  ngOnInit() {
  }

  handleClick = (option) => {
    if (option === 'browse') {
      this.data['parentElement'].classList.add('activeEdtrElement');
      this._commonService.isBrowseClicked = true;
      this._elementRef.nativeElement.querySelector('input').click();
    } else {
      this._commonService.isBrowseClicked = false;
      this.performAction(option, this.data);
    }
  }

  handleFileInput = (file, e) => {
    this.toBase64(file[0]).then((result) => {
      this._commonService.isBrowseClicked = false;
      this.fileHandler.emit({image: result});
    });
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  performAction(buttonAction, data) {
    let Device;
    this._templateService.templateframeWidth.subscribe(x => {
      if (x >= 780) { Device = 'desktop'; } else if (x <= 780 && x >= 540) { Device = 'tablet'; } else { Device = 'mobile'; }
    });

    const options = {
      element: data.parentElement,
      category: data.elementtype,
      option: buttonAction,
      device: Device
    };
    this._editorMenusService._menuActions(options);
  }

}
