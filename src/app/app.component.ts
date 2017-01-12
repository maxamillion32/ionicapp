import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AuthService } from '../providers/authservice';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage : any;

  constructor(private authServ: AuthService) {
      console.log(this.authServ.isLoggedIn());
      if(this.authServ.isLoggedIn()) 
        this.rootPage = HomePage;
      
      else
        this.rootPage = LoginPage;
   
    
  }
}
