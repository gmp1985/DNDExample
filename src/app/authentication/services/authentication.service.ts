import { Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Authentication, AuthenticationResposne } from './../interfaces/authentication.interface';
import { ConstantsService } from 'src/app/shared/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authentication: Authentication;
  isLoggedIn = false;
  redirectUrl: string;
  returnURL: string;
  authResponse: AuthenticationResposne;

  constructor(private http: HttpClient,
              private constants: ConstantsService,
              private route: ActivatedRoute,
              private router: Router) { }

  async _checkSession() {
    // let sessionData: any;
     return await this.http.get(this.constants.USER_END_POINT + '/checkSession').toPromise();
  }

  _authenticateUser(auth: Authentication) {
    const url = this.constants.USER_END_POINT + '/authenticateUser';
    return this.http.post<AuthenticationResposne>(url, auth);
  }

  _singout(): void {
    this.isLoggedIn = false;
    this.http.get(this.constants.USER_END_POINT + '/signout').subscribe(data => {
      this.router.navigateByUrl('/signin');
    });
  }

  _getQueryParams() {
    // Get the query params
    this.route.queryParams
    .subscribe(params => this.returnURL = params.return || '/home');
  }

}
