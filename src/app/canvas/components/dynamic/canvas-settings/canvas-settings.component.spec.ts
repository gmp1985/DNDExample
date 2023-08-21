import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasSettingsComponent } from './canvas-settings.component';

describe('CanvasSettingsComponent', () => {
  let component: CanvasSettingsComponent;
  let fixture: ComponentFixture<CanvasSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
