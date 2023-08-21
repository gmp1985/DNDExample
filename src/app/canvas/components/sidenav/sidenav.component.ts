import { Component, OnInit, DoCheck, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ElementListComponent } from '../dynamic/element-list/element-list.component';
import { CommonService } from '../../services/common.service';
import { TemplateService } from '../../services/template.service';
import { DialogService } from '../../Services/dialog.service';
import { CanvasSettingsComponent } from '../dynamic/canvas-settings/canvas-settings.component';

@Component({
  selector: 'ark-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, DoCheck {

  @ViewChild('elementList') elementList: ElementRef;
  @ViewChild('tempSettings') tempSettings: ElementRef;
  @ViewChild('elementListBox') elementListBox: ElementRef;
  @ViewChild('toActive') toActive: ElementRef;
  @ViewChild('canvasSettings') canvasSettings: ElementRef;
  public elementsBtn: boolean = false;
  public settingsFlag: boolean = false;
  public elementListRef;
  constructor(
    private commonService: CommonService,
    private templateService: TemplateService,
    private renderer: Renderer2,
    private dialogService: DialogService
  ) { }
  

  ngOnInit() { }
 
  ngDoCheck() {
    if (this.templateService.eleCompRef !== undefined && this.templateService.eleCompRef.hostView.destroyed !== false){
      this.elementsBtn = this.templateService.eleCompRef.instance.isactive;
    }
      
  }
  
  _createElementBox() {
    if(!this.toActive.nativeElement.classList.contains("active")){
      const options = { insertMode: 'appendChild', element: '', class: 'elementListBox' };
      this.templateService.eleCompRef = this.commonService._createDynamicComponent(ElementListComponent, '', options);
      this.elementsBtn = true;
    }
    // this.renderer.removeClass(this.toActive.nativeElement,"active");
    // this.renderer.addClass(this.toActive.nativeElement,"active");    
  }

  /**
   * Show the Canvas Setting screen in a dialog.
   */
  _showCanvasSettings() {
    this.dialogService.open(CanvasSettingsComponent, {});
  }

}
