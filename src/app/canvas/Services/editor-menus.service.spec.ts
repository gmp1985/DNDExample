import { TestBed } from '@angular/core/testing';

import { EditorMenusService } from './editor-menus.service';

describe('EditorMenusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditorMenusService = TestBed.get(EditorMenusService);
    expect(service).toBeTruthy();
  });
});
