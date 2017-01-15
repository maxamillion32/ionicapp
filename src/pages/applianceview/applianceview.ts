import { Component } from '@angular/core';
import { ViewController,ModalController, ActionSheetController,NavController, NavParams,ToastController,AlertController,LoadingController } from 'ionic-angular';
import { HomeViewService } from '../../providers/homeviewservice';
/*
  Generated class for the Applianceview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-applianceview',
  templateUrl: 'applianceview.html'
})
export class ApplianceViewPage {

	private icon;
	private toggleStatus = "true"
	private type ;
	private values =false;

	private room_data = this.navParams.get('room_data');
	private appliance_data = this.navParams.get('appliance_data');
	constructor(public viewCtrl:ViewController,public ModalCtrl:ModalController, public actionCtrl:ActionSheetController, public loadingCtrl: LoadingController, public toastCtrl:ToastController,public alertCtrl:AlertController, private homeViewServ: HomeViewService, public navCtrl: NavController, public navParams: NavParams) {
  
			this.setIcon();
			this.setStatus();
			this.type = String(this.appliance_data.type);
  }

  public setIcon() {
  	if (String(this.appliance_data.type) === "Light")
		this.icon ="md-bulb";
	else if(String(this.appliance_data.type) === 'Fan')
			this.icon = "md-cloud-circle";

  }
  public setStatus() {
  	if(this.appliance_data.status.state == 0 || this.appliance_data.status.state== undefined) 
  		this.toggleStatus = "false"
  }



 public  dismiss() {
    this.viewCtrl.dismiss();
  }
  public onChange(e) {
  	console.log(e);
  	this.toggleStatus  = String(e);
  	console.log("Event");
  	this.homeViewServ.changeLightStatus(this.room_data,this.appliance_data,e).subscribe( response => {
  		console.log(response);
  	})
  }
}

