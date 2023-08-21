import { Component, OnInit, DoCheck } from '@angular/core';
import { TemplateService } from '../../services/template.service';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'ark-ruler',
  templateUrl: './ruler.component.html',
  styleUrls: ['./ruler.component.css']
})
export class RulerComponent implements OnInit, DoCheck {
  measures:number [] = [];
  rulerOffset:number;
  workareaborderLeft: number;
  workareaborderRight: number;
  templateWidth: number;
  constructor(
      private templateservice: TemplateService,
      private commonService: CommonService
  ) {
      
   }

  _setTemplateAreaGuides(){
    this.templateservice.templateframeWidth.subscribe(x => { this.templateWidth = x; });
    this.workareaborderLeft = (this.commonService._getScreenWidth() - this.templateWidth) / 2;
    this.workareaborderRight = this.workareaborderLeft + this.templateWidth;
  }
  ngOnInit() {
    this.measures = this.templateservice._getTemplateRulerMeasure();
    this.rulerOffset = this.templateservice._getRulerOffset();
    this._setTemplateAreaGuides();
  }

  ngDoCheck(): void {
    this.measures = this.templateservice._getTemplateRulerMeasure();
    this.rulerOffset = this.templateservice._getRulerOffset();
    this._setTemplateAreaGuides();
  }

}
