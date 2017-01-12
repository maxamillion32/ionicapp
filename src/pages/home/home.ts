import { Component } from '@angular/core';

import { NavController, NavParams, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/authservice';
import { HomeService } from '../../providers/homeservice';
import { LoginPage } from '../login/login';
import { HomeViewPage } from '../homeview/homeview';
import { Home } from '../../models/home';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	
  private homes: Home[];
  

  constructor( public loadingCtrl: LoadingController,public navParams: NavParams, public toastCtrl: ToastController, public navCtrl: NavController, private  authServ: AuthService, private homeServ: HomeService, public alertCtrl: AlertController) {
  	if( !this.authServ.isLoggedIn()) {
  			this.navCtrl.setRoot(LoginPage);
  			
  	}
    
  	this.showHomePage();
    
  }

 
  public showHomePage() {
  	console.log("Hereinsidehomeview");
  	this.homeServ.getHome().subscribe(response => {
  		if(this.homeServ.doesHaveAHome()) {
  			this.homes = response;
  		}
  		
  	})
  }

  public deleteHome(id: string) {
    let prompt = this.alertCtrl.create({
      title: "Confirm Deletion",
      message: "Do you want to confirm deletion?",
      buttons: [
      {
        
        text: "Cancel",
        handler: data => {
            console.log('Cancel clicked');
           }
       },
       {
         text: "Yes",
         handler: data => {
           this.homeServ.deleteHome(id).subscribe(response => {
             let toast = this.toastCtrl.create({
               message : response.message,
               duration : 3000
            });
             toast.present();
             if(response.code === 'DELETE-SUCCESS') {
               this.showHomePage();
             }

           });
       }

       }]
    });
    prompt.present();


  }

  public editHome(id: string, home_name: string, home_description: string) {
    if(this.isEmpty(home_description)) {
      let descriptionEmpty = true;
      home_description = "Enter your description";
    }
    let prompt = this.alertCtrl.create( {
      title: 'Edit Home',
      message: 'Add/ edit the home name and description',
      inputs: [
        {
          name: 'home_name',
          placeholder: home_name
        },
        {
          name: 'home_description',
          placeholder: home_description
        }
       ],
       buttons: [
        {
        
          text: "Cancel",
          handler: data => {
            console.log('Cancel clicked');
          }
       },
       {
         text: "Update",
         handler: data => {

           if(this.isEmpty(data.home_name) && this.isEmpty(data.home_description)){
            let toast = this.createToast("Nothing to update");
            toast.present();
           }
           else {
              if(this.isEmpty(data.home_name))
                data.home_name = home_name;
              else if(this.isEmpty(data.home_description))
                data.home_description = home_description;

          
              this.homeServ.editHome(id, data.home_name,data.home_description).subscribe(response => {
                let toast= this.createToast(String(response.message));
                toast.present();
                console.log(response);
                if(response.code === 'UPDATE-SUCCESS') {
                  this.showHomePage();
                }
              })
            }
          }
        }
      ]
    })
    prompt.present();
  }



  public createHome() {
    let prompt = this.alertCtrl.create( {
      title: 'Create a new Home',
      message: 'Add a name and description',
      inputs: [
        {
          name:'home_name',
          placeholder: 'Name your home'
        },
        {
         name:'home_description',
         placeholder: 'Optional short description'
        }
        ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Create",
          handler: data => {
            if(this.isEmpty(data.home_name)) {
               this.createHome();
             
              let toast = this.createToast("Name can't be empty");
              toast.present();

            }
            else {
              this.homeServ.createHome(data.home_name,data.home_description).subscribe(response => {
                let toast =this.createToast(String(response.message));
                toast.present();
                if(response.code === 'CREATE-SUCCESS') 
                  this.showHomePage();
              
              });
            }
           }
        }
      ]
    });
    prompt.present();
  }

  public viewHome(id: string) {
    let loading = this.showLoading();
      loading.present();
    this.homeServ.viewHome(id).subscribe(response => {
      console.log(response);
       if(response.type) {
         setTimeout(() => {
           loading.dismiss();
           this.navCtrl.push(HomeViewPage, {
             home_data: response.home
           });
         });
        }
      else {
        let toast = this.createToast("The home failed to load. Unexpected error");
        toast.present();
        loading.dismiss();
      }
    });
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
