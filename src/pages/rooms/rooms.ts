import { Component } from '@angular/core';
import {ActionSheetController,NavController, NavParams,ToastController,AlertController,LoadingController } from 'ionic-angular';
import { HomeViewPage } from '../homeview/homeview';
import { HomeViewService } from '../../providers/homeviewservice';
import { AppliancesPage } from '../appliances/appliances';

/*
  Generated class for the Rooms page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-rooms',
  templateUrl: 'rooms.html'
})
export class RoomsPage {
	private room_data;
  	constructor(public actionCtrl:ActionSheetController, public loadingCtrl: LoadingController, public toastCtrl:ToastController,public alertCtrl:AlertController, private homeViewServ: HomeViewService, public navCtrl: NavController, public navParams: NavParams) {

  	this.loadRooms();

	}


	public loadRooms() {
   		this.homeViewServ.getRooms().subscribe(response => {
   			this.room_data = response.rooms;
   			console.log("OK");
   		})
   	}

   	public pressRoomEvent(room) {
   		let action = this.presentActionSheet(room);
    	action.present();
   	}

   	public tapRoomEvent(room) {
   		
   		let loading = this.showLoading();
   		loading.present();
   		console.log(room);
   	
   			setTimeout(() => {
           		loading.dismiss();
           		this.navCtrl.push(AppliancesPage, {
           		 room_data: room,
          		 });
   			});
   		
   	}

   	public tapEvents(e) {
   		let prompt = this.addRoomToHome();
   		prompt.present();
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
				text: "Cancel",
				handler: data => {
					console.log("Skipped");
					}
				},
			{
	    	   	text: "Next",
	       		handler: data => {
	       			
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
      			
      			let loading = this.showLoading();
      			loading.present();
      			this.homeViewServ.addRoomToHome(room_name,room_alt_name).subscribe(response => {
      				let toast =this.createToast(String(response.message));
               			toast.present();
               			if(response.code ==='CREATE-SUCCESS') {
               				this.loadRooms();
               			}
               			loading.dismiss();
       			
     		 	});

			}
		});
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

  	public presentActionSheet(room) {
    let actionSheet = this.actionCtrl.create({
        title: 'Choose action',
          buttons: [
          {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
             let alert =  this.presentDeleteConfirm(room);
             alert.present();
            }
          },
           {
          text: 'Edit',
          
          icon: 'clipboard',
          handler: () => {
            console.log('Edit clicked');
            }
          }]
      });
    return actionSheet;
    }

     public presentDeleteConfirm(room) {
    let prompt = this.alertCtrl.create({
         title: "Confirm deletion",
          message: `Are you sure you want to delete ${room.name}?`,
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
               this.homeViewServ.deleteRoom(room).subscribe( response => {
                   let loading = this.showLoading();
                   loading.present();
                  let toast =this.createToast(String(response.message));
                    toast.present();
                     if(response.code === 'DELETE-SUCCESS') {
                       this.loadRooms();
                     }
                     loading.dismiss();
               })
           }
         }]
    })
    return prompt;
  }

  public getAppliancesInRoom(room) {
  	if(room) {
  		this.homeViewServ.getAppliances(room).subscribe(response => {
  			
  			if(response.code === 'GET-SUCCESS')
  				return response;
  			else {
  			let toast = this.createToast(String(response.message));
  			toast.present();
  			}
  		})
  	}
  	else {let toast = this.createToast("Something unexpected happened");
  		toast.present();
  		return false;
  	}
  }

}
