import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  toggle() {
    this.isLogin = !this.isLogin;
  }

  onLogin() {
    this.authService.login();
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Loading ...' })
      .then((loadingEl) => {
        loadingEl.present();
      });
    setTimeout(() => {
      this.loadingCtrl.dismiss();
      this.router.navigate(['places/tabs/discover']);
    }, 3000);
  }

  onSignUp(){
    // console.log(this.form.valid);
  }

  onSubmit(form: NgForm){
    console.log(form.valid);
    console.log(form.value);
  }
}
