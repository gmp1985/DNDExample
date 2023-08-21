import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AuthenticationComponent } from './authentication.component';
import { AuthenticationService } from './services/authentication.service';
import { ConstantsService } from '../shared/services/constants.service';
import { AuthGuard } from '../shared/guards/auth.guard';

@NgModule({
  declarations: [SignupComponent, SigninComponent, AuthenticationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule
  ],
  providers: [ConstantsService, AuthenticationService, AuthGuard]
})
export class AuthenticationModule { }
