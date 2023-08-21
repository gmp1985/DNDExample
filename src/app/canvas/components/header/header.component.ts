import { Component, OnInit } from '@angular/core';
import { TemplateService } from './../../services/template.service';

@Component({
  selector: 'ark-canvasheader',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  over:any;
  templateName:any;
  constructor(
    private templateservice: TemplateService
  ) { }

  ngOnInit() {
    this.templateservice.templateName.subscribe(x => {this.templateName = x;});
  }
  
  _setWidth(device) {
    switch (device) {
      case "desktop": this.templateservice._setTemplateWidth(this.templateservice._getTemplateWidth()); break;
      case "tablet": this.templateservice._setTemplateWidth(760); break;
      case "mobile": this.templateservice._setTemplateWidth(380); break;
    }
  }
}
