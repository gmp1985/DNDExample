import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMenusComponent } from './box-menus.component';

describe('BoxMenusComponent', () => {
  let component: BoxMenusComponent;
  let fixture: ComponentFixture<BoxMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
