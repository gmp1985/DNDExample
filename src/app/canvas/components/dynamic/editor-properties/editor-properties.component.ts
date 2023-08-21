import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ark-editor-properties',
  templateUrl: './editor-properties.component.html',
  styleUrls: ['./editor-properties.component.css']
})
export class EditorPropertiesComponent implements OnInit {

  @Input() data: any;
  constructor() { }

  ngOnInit() {
    console.log("asdasd", this.data);
  }

}
