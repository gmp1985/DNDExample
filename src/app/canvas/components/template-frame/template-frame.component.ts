
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, ComponentRef, DoCheck, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { TemplateService } from '../../services/template.service';
import { EditorMenusService } from '../../services/editor-menus.service';
import { IframeContentComponent } from '../dynamic/iframe-content/iframe-content.component';
import { DialogService } from '../../Services/dialog.service';
import { CanvasSettingsComponent } from '../dynamic/canvas-settings/canvas-settings.component';

@Component({
  selector: 'ark-template-frame',
  templateUrl: './template-frame.component.html',
  styleUrls: ['./template-frame.component.css']
})
export class TemplateFrameComponent implements OnInit, AfterViewInit, DoCheck {
  @ViewChild('templateFrame') templateFrame: ElementRef;
  @ViewChild('templateFrameWrapper') templateFrameWrapper: ElementRef;

  public tempFrameStyle = `<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="/assets/css/canvasTempFrame.css" rel="stylesheet">
  <link href="/assets/css/templateGrid.css" rel="stylesheet">
  <link href="/assets/css/martech-icons.css" rel="stylesheet">`;

  screenHeight: number;
  templateWidth: number;
  IframeWidth: number;
  IframeHeight: number;
  templateHeight: number;
  ElementList = [];
  template = [];
  sectionHTML: any;
  isNewTemp = true;
  paramId: any;
  tempFramedoc: any;
  cmpRef: ComponentRef<any>;

  frameInfo: any[] = [];
  subscription: Subscription;

  constructor(
    private commonService: CommonService,
    private templateService: TemplateService,
    private editorMenusService: EditorMenusService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private dialogService: DialogService) {

  }

  @HostListener('window:resize', ['$event']) onresize(e) {
    const win: Window = this.templateFrame.nativeElement.contentWindow;
    const doc: Document = win.document;
    if (doc.getElementById('templateFrame')) {
      this.IframeHeight = doc.getElementById('templateFrame').offsetHeight + 30;
      this.templateService.templateframeWidth.subscribe(x => {if ( x <= 900) { this.IframeWidth = x; } else {this.IframeWidth = this.commonService._getScreenWidth(); } });
  
      this.screenHeight = this.commonService._getScreenHeight();
      this.templateWidth = this.templateService._getTemplateWidth();
      this.templateHeight = this.commonService._getScreenHeight() - 76;
    }
    
  }

  ngDoCheck() {
    const win: Window = this.templateFrame.nativeElement.contentWindow;
    const doc: Document = win.document;
    this.templateService.iframeBody.next(this.tempFramedoc);
    this.templateService.iframeBodyHeight.subscribe((height) => {
      this.IframeHeight = height;
    });
  }
  ngOnInit() {
    this.templateService.templateframeWidth.subscribe(x => {if ( x <= 900) { this.IframeWidth = x;} else {this.IframeWidth = this.commonService._getScreenWidth();}});

    this.screenHeight = this.commonService._getScreenHeight();
    this.templateWidth = this.templateService._getTemplateWidth();
    this.templateHeight = this.commonService._getScreenHeight() - 76;

    this.tempFramedoc = this.templateFrame.nativeElement.contentDocument || this.templateFrame.nativeElement.contentWindow;

    // this.commonService.vFrameDoc = this.vframe.nativeElement;

    this.templateService._setTempFrame(this.tempFramedoc);

    this._loadTemplateStyles();

    this.route.paramMap.subscribe(params => {
      if (params.keys.length == 0) {
        this.isNewTemp = true;
      } else {
        this.paramId = this.route.snapshot.params.id;
        this.isNewTemp = false;
      }
    });

    let elementPromise = new Promise((resolve, reject) => {
      this.templateService._getElements()
      .subscribe((data: any) => {
        this.ElementList = data.elements;

        this.templateService.elementList = this.ElementList;
      });

      setTimeout(function(){
        resolve("Success!");
      }, 250);
    });

    elementPromise.then((successMessage) => {
      this._loadTemplate(this.isNewTemp);

      this._fetchEditorOptions();
    });
  }

  ngAfterViewInit() {
    this.onLoad();
  }


  _fetchEditorOptions() {
    if (typeof this.editorMenusService.editorOptions === 'undefined') {
      this.editorMenusService._getEditorOptions();
    }
  }

  // 1. loads canvas style canvasTempFrame.css for canvas styling.
  // 2. loads templateGrid.css for grid styleing. this should be available on download of template.
  // 3. loads all required fonts like material, etc to iFrame in canvas
  _loadTemplateStyles() {
    const win: Window = this.templateFrame.nativeElement.contentWindow;

    const doc: Document = win.document;
    doc.open();
    doc.write(this.tempFrameStyle);
    doc.close();
  }

  // Loads the template if isNewTemp is true then empty frame will be fetched from DB and added.
  // If isNewTemp is false existed components mapped will be added to show the saved template.
  _loadTemplate(isNewTemp: any) {
    if (isNewTemp == true) {
      this._loadNewSection();
    }
    else {
      this._loadSavedComps();
    }
  }

  // loads new empty frame for new template creation.
  _loadNewSection() {
    //this.templateService.elementList = this.ElementList;

    //let elementHTML = this.templateService._getElementDataById(this.templateService.elementList, '100', 'elementHtml');

    //const compData = { sectionHTML: elementHTML };
    //const options = { insertMode: 'appendChild', element: this.tempFramedoc.body, class: '' };
    //this.cmpRef = this.commonService._createDynamicComponent(IframeContentComponent, compData, options);

    this.templateService._getElements()
      .subscribe((data: any) => {
        this.ElementList = data.elements;

        this.templateService.elementList = this.ElementList;

        let elementHTML = this.templateService._getElementDataById(this.templateService.elementList, '100', 'elementHtml');

        const compData = { sectionHTML: elementHTML };
        const options = { insertMode: 'appendChild', element: this.tempFramedoc.body, class: '' };
        this.cmpRef = this.commonService._createDynamicComponent(IframeContentComponent, compData, options);

        this.dialogService.open(CanvasSettingsComponent, {});
      });
  }

  // Loads already saved templates with component mapped.
  _loadSavedComps() {
    this.templateService._getSavedTemp()
      .subscribe((data: any) => {
        this.template = data;

        const compData = { sectionHTML: this.template[this.paramId].template };
        const options = { insertMode: 'appendChild', element: this.tempFramedoc.body, class: '' };
        this.cmpRef = this.commonService._createDynamicComponent(IframeContentComponent, compData, options);
            
        this.templateService.templateWidth = this.template[this.paramId].templateWidth;
        this.templateService.templateframeWidth.next(this.templateService.templateWidth);        
      });
  }

  onLoad() {
    this.tempFramedoc = this.templateFrame.nativeElement.contentDocument || this.templateFrame.nativeElement.contentWindow;
  }

  // Cleanup properly. You can add more cleanup-related stuff here.
  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}

