import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should enter email address and check to be truthy', () => {
    page.navigateTo();
    // expect(page.getTitleText()).toEqual('Welcome to ark!');
    const email = page.getEmailField();
    email.sendKeys('anoop.yathish@oracle.com');
    expect(email.getAttribute('value')).toBeTruthy();
  });

  it('should click singup link and fill form', () => {
    const singup = page.getSignupElement();
    singup.click();

    const firstName = page.getFirstNameField();
    firstName.sendKeys('Anoop');

    const lastName = page.getLastNameField();
    lastName.sendKeys('Yathish');

    const email = page.getSEmailField();
    email.sendKeys('anoop.yathish@oracle.com');

    const phone = page.getPhoneField();
    phone.sendKeys('903 502 5544');

    const country = page.getCountryField();
    country.click();

    const countryOptions = page.getCountryOptions();
    expect(countryOptions.count()).toBe(243);
    countryOptions.first().click();

    const lob = page.getLOBField();
    lob.sendKeys('IT Developer');

    expect(firstName.getAttribute('value')).toBeTruthy();
    browser.driver.sleep(5000);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
