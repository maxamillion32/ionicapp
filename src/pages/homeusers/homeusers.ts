import { Component } from '@angular/core';
import { ActionSheetController ,NavController, NavParams,ToastController,AlertController,LoadingController } from 'ionic-angular';
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

 	constructor(public actionCtrl:ActionSheetController, public homeViewServ: HomeViewService, public navCtrl: NavController, public navParams: NavParams, private alertCtrl:AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
  		this.loadUsersList();
  	}


	public loadUsersList() {
		this.homeViewServ.getUsers().subscribe( response => {
			this.user_data = response.users;

		});

	}

  public pressUserEvent(user) {
    let action = this.presentActionSheet(user);
    action.present();
  }
  public tapAddUser(e) {
    let prompt= this.addUserToHome();
    prompt.present();
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
             text: "Cancel",
             handler: data => {

             }

            },
            {
             text: "Add user",
             handler: data => {
               
               if(this.isEmpty(data.user_email)|| this.isEmpty(data.user_name)) {
                 let toast = this.createToast("Fill them up will ya! Can't leave the fields empty.");
                 toast.present();
                 let prompt = this.addUserToHome();
                      prompt.present();
               }
               else{
                 let loading = this.showLoading();
                 loading.present();
                 this.homeViewServ.addUserToHome(data.user_email,data.user_name).subscribe(response => {
                  let toast =this.createToast(String(response.message));
                      toast.present();
                     if(response.code === 'ADD-SUCCESS') {
                       this.loadUsersList();
                     }
                     loading.dismiss();
                 })
               }
             }
            }
           
           

           ]
      })
      return prompt;
  }

   public presentActionSheet(user) {
    let actionSheet = this.actionCtrl.create({
        title: 'Choose action',
          buttons: [
          {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
             let alert =  this.presentDeleteConfirm(user);
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
  public presentDeleteConfirm(user) {
    let prompt = this.alertCtrl.create({
         title: "Confirm deletion",
          message: `Are you sure you want to delete ${user.name}?`,
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
               this.homeViewServ.deleteUser(user).subscribe( response => {
                   let loading = this.showLoading();
                   loading.present();
                  let toast =this.createToast(String(response.message));
                    toast.present();
                     if(response.code === 'DELETE-SUCCESS') {
                       this.loadUsersList();
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
