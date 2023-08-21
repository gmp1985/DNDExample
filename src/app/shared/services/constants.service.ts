/**
 * Global Contants Service Provider
 *
 * @export
 * @class ConstantsService
 */
export class ConstantsService {

  // public readonly BASE_URL: string = 'http://localhost:7001/ark-app';
  public readonly BASE_URL: string = '.';
  public readonly USER_END_POINT: string = this._getBaseURL() + '/api/user';

  // Email pattern regex
  public readonly EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public _getBaseURL() {
    const baseURL = window.location.origin;
    return 'http://nacismktl222.us.oracle.com:10022/ark-app';
    // if (baseURL === 'http://localhost:4200') {
    //   return 'http://localhost:7001/ark-app';
    // } else {
    //   return this.BASE_URL + '/ark-app';
    // }
  }

}
