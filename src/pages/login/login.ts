import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/authservice';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { Response } from '../../models/response';
import 'rxjs/add/observable/throw';


/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
	private response: Response[];

  private loading: Loading;
  private registerCredentials= {email:"", password: ""};
  constructor(public navCtrl: NavController, private authServ: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}

  public createAccount() {
  	this.navCtrl.push('RegisterPage');
  }
  
  public login() {
  	console.log("I am here");
  	this.showLoading();
  	this.authServ.login(this.registerCredentials).subscribe(response => {
  		if(this.authServ.isLoggedIn()) {
  			setTimeout(() => {
  				console.log(response);
  				this.loading.dismiss();
  				this.navCtrl.setRoot(HomePage);
  			});
  		}
  		else {	
  				this.showError(response.message);
  		}
  	},
  	error => {
  		this.showError(error);
  		
	})
  }


  public showLoading() {
  	this.loading = this.loadingCtrl.create({
  		content: 'Please wait...'
  	});
  	this.loading.present();
  }

  public showError(text) {
  	this.loading.dismiss();
  	let alert = this.alertCtrl.create({
  		 title: 'Fail',
      	 subTitle: text,
     	 buttons: ['OK']
    });
    alert.present(prompt);
  	}
  }