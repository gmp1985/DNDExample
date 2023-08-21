import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('ark-root h1')).getText() as Promise<string>;
  }

  getEmailField() {
    return element(by.css('[formcontrolname="email"]'));
  }

  getSignupElement() {
    return element(by.css('[ng-reflect-router-link="/signup"]'));
  }

  getFirstNameField() {
    return element(by.css('[formcontrolname="Firstname"]'));
  }

  getLastNameField() {
    return element(by.css('[formcontrolname="Lastname"]'));
  }

  getSEmailField() {
    return element(by.css('[formcontrolname="Email"]'));
  }

  getPhoneField() {
    return element(by.css('[formcontrolname="Phone"]'));
  }

  getCountryField() {
    return element(by.css('mat-select'));
  }

  getCountryOptions() {
    return element.all(by.css('.cdk-overlay-container mat-option'));
  }

  getLOBField() {
    return element.all(by.css('[formcontrolname="LOB"]'));
  }
}
