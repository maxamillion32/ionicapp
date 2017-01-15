import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,AlertController,LoadingController } from 'ionic-angular';
import { HomeService } from '../../providers/homeservice';
import { HomeViewService } from '../../providers/homeviewservice';
import { HomePage } from '../home/home';
import { HomeUsersPage } from '../homeusers/homeusers';
import { ShareService } from '../../services/ShareService';
import { RoomsPage } from '../rooms/rooms';
/*
  Generated class for the Homedata page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-homeview',
  templateUrl: 'homeview.html',

})
export class HomeViewPage {
	private tab1; private tab2;
	private device_status = false;
	private device_code;

	private room_data;
	private i=0;
  	private firstTimeView: boolean =false;	

    private data = this.navParams.get('home_data');
    private count; // this is to count the alert phase 1 => firstAlert, 2=> addUseraler etc.
    private skipRoom =false;
  	constructor(public loadingCtrl: LoadingController, public toastCtrl:ToastController,public alertCtrl:AlertController, private homeViewServ: HomeViewService, private homeServ: HomeService, public navCtrl: NavController, public navParams: NavParams) {
  			this.tab1 = HomeUsersPage;
  			this.tab2 = RoomsPage;


  		if(this.homeViewServ.isFirstTimeView(this.data)) {
  			this.firstTimeView = true;
  			this.count = 0;
  			this.isDeviceAuthenticated();
  			
  			 			
  		}

  		
  	}

  	public isDeviceAuthenticated() {
  		if(this.data.device_status == true) {
  			this.device_status = true;
  			return true;
  		}
  		else {
  			this.device_code = this.data.device_auth_code;
  			return false
  		}
  	}
  	public tapEvents() {
  		console.log("Why aint this getting executed");
  		let prompt =this.addRoomToHome();
  		//prompt.present();
  	}

  	public initializeSetup() {
  		let prompt =  this.firstAlert();
  		prompt.present();

  	}


  	public firstAlert() {
  		let prompt = this.alertCtrl.create({
	     	title: "Family",
	      	message: "Add your family users to this group!",
	  		buttons: [
	   		{
	        
	        	text: "Cancel",
	       		handler: data => {
	         	   console.log('Cancel clicked');
	          	}
	      	},
	    	{
	    	   	text: "Continue",
	    	   	handler: data => {
	     	  		console.log('Continue clicked');
	     	  		this.count =1;
	     	  		let prompt = this.addUserToHome();
	     	  		prompt.present();
	     	  		
	   			}
	   		}]
		})
		return prompt;
	}

	public addUserToHome() {
		let prompt = this.alertCtrl.create({
	     	title: "Add/Invite user",
	      	message: "User will be invited if they are not signed up with us.",
	      	inputs:[{
	      		name: 'user_email',
	      		placeholder: 'johnk@example.com'
	      	},
	      	{
	      		name: 'user_name',
	      		placeholder: 'John Kennedy'
	      	}],
	      	buttons: [
	       	{
	       		text: "Add user",
	       		handler: data => {
	       			this.count = 2;
	       			if(this.isEmpty(data.user_email)|| this.isEmpty(data.user_name)) {
	       				let toast = this.createToast("Fill them up will ya! Can't leave the fields empty.");
	       				toast.present();
	       				let prompt = this.addUserToHome();
               			 prompt.present();
	       			}
	       			else{
	       				this.homeViewServ.addUserToHome(data.user_email,data.user_name).subscribe(response => {
	       				 let toast =this.createToast(String(response.message));
               			 toast.present();
               			 let prompt = this.addUserToHome();
               			 prompt.present();
	       				})
	       			}
	       		}
	       	},
	       	{
	       		text: "Add a room",
	       		handler: data => {

	       			let prompt = this.addRoomToHome();
	       			prompt.present();

	       		}
	       	}

	       	]
	    })
	    return prompt;
	}

	public addRoomToHome() {
		let prompt = this.alertCtrl.create({
			title: 'Room your Home!',
			message: 'Tell us about your rooms... ',

			inputs:[{
	      		name: 'room_name',
	      		placeholder: 'eg: Dining Hall, but no random junk here'
	      	},
	      	{
	      		name: 'room_alt_name',
	      		placeholder: 'eg: Kevin Bedroom'
	      	}],
	 	   buttons: [{
	    	   	text: "Next",
	       		handler: data => {
	       			this.count =3;
	       			if(this.isEmpty(data.room_name)|| this.isEmpty(data.room_alt_name)) {
	       				let toast = this.createToast("Don't be shy, every room has a name");
	       				toast.present();
	       				let prompt = this.addRoomToHome();
	       				prompt.present();
	       			}
	       			else {
	       				let prompt =this.addRoomFloor(data.room_name, data.room_alt_name);
	       				prompt.present();
	       			}
				}
			}]
		})
		if(this.skipRoom) {
			prompt.addButton({
				text: 'Skip',
				handler: data => {
					let prompt = this.finalAlert();
					prompt.present();
				}
			})
		}
		return prompt;
	}


	public addRoomFloor(room_name: string ,room_alt_name: string) {
		let prompt = this.alertCtrl.create();
		prompt.setTitle('Which floor?');
		prompt.addInput({
     		type: 'checkbox',
     	 	label: 'First Floor',
     	 	value: 'first',
     	 	checked: true,
        });

    	prompt.addInput({
      		type: 'checkbox',
      		label: 'Second Floor',
      		value: 'second'
    	});
    	prompt.addInput({
    		type: 'checkbox',
    		label: 'Third Floor',
    		value: 'third'
    	});
    	prompt.addButton({
      		text: 'Okay,Create that room!',
      		handler: data => {
      			this.skipRoom = true;
      			this.count =4;
      			console.log(data);
      			this.homeViewServ.addRoomToHome(room_name,room_alt_name).subscribe(response => {
      				let toast =this.createToast(String(response.message));
               			toast.present();
               			let prompt = this.addRoomToHome();
               			prompt.present();
               			
       			
     		 	});

			}
		});
    	return prompt;
   	}

   	public finalAlert() {
   		console.log("final alert");
   		let prompt = this.alertCtrl.create({
   			title: 'Congrats.',
   			message: 'You are nearly done. Finish the setup and enjoy your home',
   			buttons: [
   			{
   				text: 'Finish Setup',
      			handler: data => {
      				let loading = this.showLoading();
      				loading.present();
 					this.homeServ.viewHome(this.data._id).subscribe(response => {
    					console.log(response);
     					if(response.type) {
       						setTimeout(() => {
       							
       							this.data = response.home;
       							this.firstTimeView = false;
       							loading.dismiss();

      						});
      					}
      					else {
       						let toast = this.createToast("The home failed to load. Unexpected error");
   						    toast.present();
     						loading.dismiss();
     					}
     				});
     			}
   			}]
   		})
   		return prompt;
   	}

   	

	public isEmpty(text: string) {
   		if(text === "" || text == null) {
     		return true;
    }
  }

    public createToast(text: string) {

        let toast  = this.toastCtrl.create({
            message: text,
            duration: 3000
        });
       return toast;
  }


	public showLoading() {
    	let loading = this.loadingCtrl.create({
      	content: 'Please wait...'
    	});
    	return loading;
  	}


}

