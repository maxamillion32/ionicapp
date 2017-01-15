import { Component } from '@angular/core';
import {ModalController, ActionSheetController,NavController, NavParams,ToastController,AlertController,LoadingController } from 'ionic-angular';
import { HomeViewPage } from '../homeview/homeview';
import { HomeViewService } from '../../providers/homeviewservice';
import { ApplianceViewPage } from '../applianceview/applianceview';
/*
  Generated class for the Appliances page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-appliances',
  templateUrl: 'appliances.html'
})
export class AppliancesPage {
	private room_data = this.navParams.get('room_data');
	private appliance_data ;
 	constructor(public modalCtrl:ModalController, public actionCtrl:ActionSheetController, public loadingCtrl: LoadingController, public toastCtrl:ToastController,public alertCtrl:AlertController, private homeViewServ: HomeViewService, public navCtrl: NavController, public navParams: NavParams) {

  	this.loadAppliances();

	}

	public loadAppliances() {
		this.homeViewServ.getAppliances(this.room_data).subscribe(response => {
			this.appliance_data = response.appliance;
			console.log(response);
			
		})
	}

	public tapEvents(e) {
   		let prompt = this.addApplianceToRoom();
   		prompt.present();
   	}

   		public addApplianceToRoom() {
		let prompt = this.alertCtrl.create({
			title: 'Add an appliance!',
			message: 'Tell us about appliance... ',

			inputs:[{
	      		name: 'appliance_name',
	      		placeholder: 'Ceiling Fan, CFL lighting'
	      	},
	      	{
	      		name: 'appliance_id',
	      		placeholder: 'Fill this later if you are not sure'
	      	},
	      	{
	      		name: 'appliance_description',
	      		placeholder: 'Optional'
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
	       			
	       			if(this.isEmpty(data.appliance_name)) {
	       				let toast = this.createToast("Oops, can't leave that field empty");
	       				toast.present();
	       				let prompt = this.addApplianceToRoom();
	       				prompt.present();
	       			}
	       			else {
	       				let prompt =this.addApplianceType(data.appliance_name, data.appliance_id, data.appliance_description);
	       				prompt.present();
	       			}
				}
			}]
		})
		
		return prompt;
	}

	public addApplianceType(appliance_name: string ,appliance_id: number, appliance_description: string) {
		let prompt = this.alertCtrl.create();
		prompt.setTitle('Appliance type');
		prompt.addInput({
     		type: 'checkbox',
     	 	label: 'Light',
     	 	value: 'Light',
     	 	checked: true,
        });

    	prompt.addInput({
      		type: 'checkbox',
      		label: 'Fan',
      		value: 'Fan'
    	});
    	prompt.addInput({
    		type: 'checkbox',
    		label: 'Air-conditioner',
    		value: 'AC'
    	});
    	prompt.addButton({
      		text: 'Okay!',
      		handler: data => {
      			console.log(data[0]);
      			let appliance_type = data[0];
      			let loading = this.showLoading();
      			loading.present();
      			this.homeViewServ.addAppliance(this.room_data,appliance_name,appliance_type,appliance_description,appliance_id).subscribe(response => {
      				let toast =this.createToast(String(response.message));
               			toast.present();
               			if(response.code ==='CREATE-SUCCESS') {
               				this.loadAppliances();
               			}
               			loading.dismiss();
       			
     		 	});

			}
		});
    	return prompt;
   	}


   		public pressApplianceEvent(appliance) {
   		let action = this.presentActionSheet(appliance);
    	action.present();
   	}


   	 public tapApplianceEvent(appliance) {
   		
   		let loading = this.showLoading();
   		loading.present();
   		
   	
   			setTimeout(() => {
           		loading.dismiss();
           		let applianceview =this.modalCtrl.create(ApplianceViewPage, {
           		 room_data: this.room_data,
           		 appliance_data: appliance,
          		 });
           		applianceview.present();
   			});
   		
   	}



   		public presentActionSheet(appliance) {
    let actionSheet = this.actionCtrl.create({
        title: 'Choose action',
          buttons: [
          {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
             let alert =  this.presentDeleteConfirm(appliance);
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

   	  public presentDeleteConfirm(appliance) {
    let prompt = this.alertCtrl.create({
         title: "Confirm deletion",
          message: `Are you sure you want to delete ${appliance.name}?`,
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
               this.homeViewServ.deleteAppliance(this.room_data,appliance).subscribe( response => {
                   let loading = this.showLoading();
                   loading.present();
                  let toast =this.createToast(String(response.message));
                    toast.present();
                     if(response.code === 'DELETE-SUCCESS') {
                       this.loadAppliances();
                     }
                     loading.dismiss();
               })
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
