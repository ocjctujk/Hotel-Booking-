import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isUserAuthenticated = true;
  private _userId = 'abc';
  constructor() {}

  get isUserAuthenticated() {
    return this._isUserAuthenticated;
  }
  get userId(){
    return this._userId;
  }

  login() {
    this._isUserAuthenticated = true;
    
  }
  logout() {
    this._isUserAuthenticated = false;
  }
}
