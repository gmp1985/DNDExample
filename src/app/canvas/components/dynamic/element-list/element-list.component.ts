import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { TemplateService } from '../../../services/template.service';

@Component({
  selector: 'ark-element-list',
  templateUrl: './element-list.component.html',
  styleUrls: ['./element-list.component.css']
})
export class ElementListComponent implements OnInit {
  ElementList = [];
  public ElementGroups = [];  
  public ElementGroupData = {}; 
  private isactive: boolean = true;
  constructor(
    private templateService: TemplateService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {       
    this.ElementList = this.templateService.elementList;
        
    for(let i = 0; i< this.ElementList.length; i++){    
        if(this.ElementGroups.indexOf(this.ElementList[i].elementGroup) === -1){
          this.ElementGroups.push(this.ElementList[i].elementGroup);        
        }        
    }    

    let self = this; 
    self.ElementGroups.map(function (currentValue, index, arr){
      let ElementGroupArray = [];
      let ElementListGroup = currentValue;
      self.ElementList.map(function (currentValue, index, arr) { 
        if(ElementListGroup == currentValue.elementGroup){
          ElementGroupArray.push(currentValue);          
          self.ElementGroupData[ElementListGroup] = ElementGroupArray;  
        }  
      });  
    });      
  }  

  _closeElementBox() {
    this.isactive = false;
    this.templateService.eleCompRef.destroy();    
  }
}
