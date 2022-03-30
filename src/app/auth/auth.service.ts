import { HttpClient } from '@angular/common/http';
import { APP_ID, Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface authResponseData {
  email: string;
  expiresIn: number;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  Auth_APIKEY = 'AIzaSyD4xTJ540_JxI6ks03BvSgLMhUThrlCzTc';
  constructor(private http: HttpClient) {}

  get isUserAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else false;
      })
    );
  }
  get userId() {
    let token;
    this._user.subscribe((user) => {
      if (!user) {
        return;
      }
      token = user.token;
    });
    return token;
    // return this._user.asObservable().pipe(
    //   map((user) => {
    //     if (user) {
    //       user.id;
    //     } else {
    //       return null;
    //     }
    //   })
    // );
  }

  logout() {
    this._user.next(null);
  }

  signUp(email: string, password: string) {
    console.log(email + password);
    return this.http
      .post<authResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          this.Auth_APIKEY,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((userData) => {
          const expirationDate = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
          );
          this._user.next(
            new User(
              userData.localId,
              userData.email,
              userData.idToken,
              expirationDate
            )
          );
        })
      );
  }

  logIn(email: string, password: string) {
    console.log(email);
    console.log(password);

    return this.http
      .post<authResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          this.Auth_APIKEY,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((userData) => {
          const expirationDate = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
          );
          this._user.next(
            new User(
              userData.localId,
              userData.email,
              userData.idToken,
              expirationDate
            )
          );
          this.storeAuthData(
            userData.localId,
            userData.idToken,
            expirationDate.toISOString()
          );
        })
      );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string
  ) {
    const authData = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
    });
    Storage.set({ key: 'Authdata', value: authData });
  }

  autoLogin() {
    let parsedData;
    from(Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
        };
      })
    );
    const expirationTime = new Date(parsedData.tokenExpirationDate);
    if (expirationTime <= new Date()) {
      return null;
    }
    const user = new User(
      parsedData.userId,
      parsedData.email,
      parsedData.token,
      expirationTime
    );
    this._user.next(user);
    this.logIn(parsedData.email,parsedData.password);
  }
}
