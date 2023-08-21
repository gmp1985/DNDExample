import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      this.authService._checkSession().then( data => {
        if (data === true) {
          resolve(true);
        } else {
          this.router.navigate(['/signin'], {
            queryParams: {
              return: state.url
            }
          });
          resolve(true);
        }
      })
      .catch(err => {
        resolve(false);
      });
    });
  }

}
