import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ConstantsService } from 'src/app/shared/services/constants.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Authentication, AuthenticationResposne } from './../../interfaces/authentication.interface';


@Component({
  selector: 'ark-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  auth: Authentication;
  authResponse: AuthenticationResposne;
  post: any;
  isFormValid = true;

  constructor(private formBuilder: FormBuilder,
              private constants: ConstantsService,
              private authService: AuthenticationService,
              private router: Router
    ) { }

  ngOnInit() {
    this.createForm();
    this.authService._getQueryParams();
  }

  createForm() {
    this.signInForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.constants.EMAIL_REGEX)]],
      validate: ''
    });
  }

  getErrorEmail() {
    return this.signInForm.get('email').hasError('required') ? 'Field is required' :
      this.signInForm.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }

  onSubmit(post: any) {
    this.auth = {userId: post.email};
    if (this.getErrorEmail() === '') {
      this.isFormValid = true;
      this.authService._authenticateUser(this.auth).subscribe(data => {
        this.authResponse = data;
        if (this.authResponse.userDetails.isValidUser) {
          this.authService.isLoggedIn = true;
          this.router.navigateByUrl(this.authService.returnURL);
        } else {
          this.authService.isLoggedIn = false;
        }
      });
    } else {
      this.isFormValid = false;
    }
  }

}
