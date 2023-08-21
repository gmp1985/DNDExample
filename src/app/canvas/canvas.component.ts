import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { TemplateService } from './services/template.service';
import { CommonService } from './services/common.service';
@Component({
  selector: 'ark-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, DoCheck {
  overlay: any;
  templateGrid: any;
  bgGrid: any;
  bgGridOffset: any;
  templateOffset: any;
  templateWidth: any;
  iframeBody: any;
  constructor(
    private templateservice: TemplateService,
    private commonservice: CommonService
  ) { }

  @HostListener('window:resize', ['$event']) onresize(e) {
    console.log('resizing...')
  }

  ngOnInit() {
    this.templateservice.isRulerClicked.subscribe(x => { this.overlay = x;});
    this.templateservice.templateframeWidth.subscribe(x => { this.templateWidth = x; });
    this._loadGridLayout();
  }

  ngDoCheck() {
    this._loadGridLayout();
    if (this.iframeBody === undefined || this.iframeBody === 'undefined' || this.iframeBody === null) {
      this.templateservice.iframeBody.subscribe((doc) => {
        this.iframeBody = doc;
        if (this.iframeBody.getElementById('templateFrame') !== null) {
          const height = this.iframeBody.getElementById('templateFrame').offsetHeight + 100;
          this.templateservice.iframeBodyHeight.next(height);
        }
      });
    } else {
      if (this.iframeBody.getElementById('templateFrame') !== null) {
        const height = this.iframeBody.getElementById('templateFrame').offsetHeight + 100;
        this.templateservice.iframeBodyHeight.next(height);
      }
    }
  }

  _loadGridLayout(){
    this.templateOffset = this.templateservice._getLeftScreenWidth()/2;
    this.templateGrid = this.templateservice._getGridLayout(this.templateWidth);
    this.bgGrid = this.templateservice._getGridLayout(5000);
    this.bgGridOffset =  this.templateservice._getGridLayoutOffset(this.templateservice._getLeftScreenWidth() / 2);
  }
  _removeQuickmenu(){
    console.log('...')
  }

}
