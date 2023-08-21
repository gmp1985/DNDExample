import { Injectable } from '@angular/core';
import { MenuLinks } from '../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private menuLinks: MenuLinks;
  constructor() { }

  getMenuLinks() {
  }
}
