import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemelistComponent } from './themelist.component';

describe('ThemelistComponent', () => {
  let component: ThemelistComponent;
  let fixture: ComponentFixture<ThemelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
