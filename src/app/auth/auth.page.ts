import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // if (Storage.get({ key: 'authData' })) {
    //   this.authLogin();
    // }
  }
  authLogin() {
    this.authService.autoLogin();
  }

  toggle() {
    this.isLogin = !this.isLogin;
  }

  onLogin(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;
    console.log(email + password);
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Loading ...' })
      .then((loadingEl) => {
        loadingEl.present();
        console.log(email + password);

        this.authService.logIn(email, password).subscribe(
          (data) => {
            console.log(data);
            this.loadingCtrl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          (error) => {
            this.loadingCtrl.dismiss();
            console.log(error);
            let message = error.error.error.message;
            this.showAlert(message);
          }
        );
      });
    form.reset();
  }

  onSignUp(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Loading ...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.authService.signUp(email, password).subscribe(
          (data) => {
            console.log(data);
            this.loadingCtrl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          (error) => {
            this.loadingCtrl.dismiss();
            let message = error.error.error.message;
            console.log(error);

            this.showAlert(message);
          }
        );
      });
    form.reset();
    // console.log(this.form.valid);
  }

  showAlert(message: string) {
    this.alertCtrl
      .create({
        message: message,
        buttons: [
          {
            text: 'Try again',
            role: 'cancel',
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
