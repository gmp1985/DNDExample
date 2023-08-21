import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Component({
  selector: 'ark-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  over:string = "over";

  constructor(
    private sharedService: SharedService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.sharedService.getMenuLinks();
  }

  singOut() {
    this.authService._singout();
  }

}
