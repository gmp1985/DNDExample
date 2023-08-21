import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AuthenticationComponent } from './authentication.component';


const routes: Routes = [
  { path: '',
    component: AuthenticationComponent,
    children: [
                { path: '', redirectTo: 'signin', pathMatch: 'full'},
                { path: 'signin', component: SigninComponent },
                { path: 'signup', component: SignupComponent }
              ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
