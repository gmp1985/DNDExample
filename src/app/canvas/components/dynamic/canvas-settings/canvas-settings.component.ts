import { Component, OnInit, Inject, NgModule, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateService } from 'src/app/canvas/services/template.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ark-canvas-settings',
  templateUrl: './canvas-settings.component.html',
  styleUrls: ['./canvas-settings.component.css']
})
export class CanvasSettingsComponent implements OnInit {

  myDropDown = 1600;
  model: any = {};
  registrationForm: FormGroup;
  isSubmitted = false;
  tempWidthSelVal = 1600;  
  tempWidthSelTxt = 'Select Width';

  // template Width List
  tempWidths: any = ['1600px', '1360px', '1200px', '614px'];

  constructor(public dialogRef: MatDialogRef<CanvasSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateService: TemplateService,
    private renderer: Renderer2,
    public fb: FormBuilder) { }

  ngOnInit() {    
    /*########### Form ###########*/
    this.registrationForm = this.fb.group({
      tempWidthSel: ['', [Validators.required]],
      tempSName: ['', [Validators.nullValidator]],
      tempFName: ['', [Validators.nullValidator]]
    });

    this.templateService.templateWidth = 1600;
  }  

  changeTempWidth(e: any){    
    this.tempWidthSelVal = e.target.value;
    if(this.tempWidthSelVal == 1600){
      this.tempWidthSelTxt =  '1600px (recommended)';
    }
    else{
      this.tempWidthSelTxt = this.tempWidthSelVal + 'px';
    }
  }  

  get f() { return this.registrationForm.controls; }

  onSubmit() {    
    this.isSubmitted = true;
    let self = this;
    
    // stop here if form is invalid
    if (this.registrationForm.invalid) {
        return;
    }
        
    this.templateService.templateWidth = +this.registrationForm.value.tempWidthSel;
    this.templateService.templateframeWidth.next(this.templateService.templateWidth);
    if(this.registrationForm.value.tempSName == ''){
      this.registrationForm.value.tempSName = 'ARK-Prototype';
    }
    
    this.templateService.templateName.next(this.registrationForm.value.tempSName);
    
    Array.prototype.slice.call(this.templateService.tempFrameValue.querySelectorAll('[ark-data=container]')).map(currentValue => {
      self.renderer.setStyle(currentValue, 'width', this.registrationForm.value.tempWidthSel + 'px');
    });    

    this.dialogRef.close();
  }
}
