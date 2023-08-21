import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFrameComponent } from './template-frame.component';

describe('TemplateFrameComponent', () => {
  let component: TemplateFrameComponent;
  let fixture: ComponentFixture<TemplateFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
