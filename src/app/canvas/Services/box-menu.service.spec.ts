import { TestBed } from '@angular/core/testing';

import { BoxMenuService } from './box-menu.service';

describe('BoxMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoxMenuService = TestBed.get(BoxMenuService);
    expect(service).toBeTruthy();
  });
});
