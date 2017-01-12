import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,AlertController,LoadingController } from 'ionic-angular';
import { HomeService } from '../../providers/homeservice';
import { HomeViewService } from '../../providers/homeviewservice';
import { HomePage } from '../home/home';

/*
  Generated class for the Homeusers page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-homeusers',
  templateUrl: 'homeusers.html'
})
export class HomeUsersPage {
	private user_data;

 	constructor(public homeViewServ: HomeViewService, public navCtrl: NavController, public navParams: NavParams) {
  		this.loadUsersList();
  	}


	public loadUsersList() {
		this.homeViewServ.getUsers().subscribe( response => {
			this.user_data = response.users;

		});

	}
}
