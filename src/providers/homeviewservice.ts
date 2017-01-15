import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthService } from './authservice';
import { HomeService } from '../homeservice';

/*
  Generated class for the Homeviewservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HomeViewService {
	private home_data;
  private serverApi= 'http://ec2-54-145-228-191.compute-1.amazonaws.com:8080';
  constructor(public http: Http) {
    console.log('Hello Homeviewservice Provider');
  }

  

  public isFirstTimeView(data) {
  	this.home_data = data;
  	
  	if(this.home_data.rooms.length==0 && this.home_data.users.length==0) {
  		return true;
  	}
  }

  public addUserToHome(user_email: string, user_name: string) {
     let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', String(localStorage.getItem('auth_token')));
    let body = JSON.stringify({ add_user_email: user_email, add_user_name: user_name});
    return this.http.post(`${this.serverApi}/home/${this.home_data._id}/user`, body, {headers})
       .map(res => res.json())
       .map(res => {
         if(res.code === 'ADD-SUCCESS') {
           console.log("SUccess");
         }
         return res;
       })
    }

    public addRoomToHome(name: string, alt_name: string) {
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      let body = JSON.stringify({room_name: name,room_alt_name: alt_name });
      return this.http.post(`${this.serverApi}/home/${this.home_data._id}/room`,body, {headers})
        .map(res => res.json())
        .map(res => {
          console.log(res);
          if(res.code === 'CREATE-SUCCESS') {
            console.log("SUccess");
          }
         return res;
       })

    }

    public getUsers() {
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      
      return this.http.get(`${this.serverApi}/home/${this.home_data._id}/user`, {headers})
        .map(res => res.json())
        .map(res => {
          console.log(res);
          if(res.code === 'GET-SUCCESS') {
            console.log("Get success");

          }
          return res;
        })
    }

    public getRooms() {
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      return this.http.get(`${this.serverApi}/home/${this.home_data._id}/room`, {headers})
      .map(res=>res.json())
      .map(res => {
          console.log(res);
          if(res.code === 'GET-SUCCESS') {
            console.log("Get done");

          }
          return res;
        })
    }

    public deleteUser(user) {
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      return this.http.delete(`${this.serverApi}/home/${this.home_data._id}/user/${user._id}`,{headers})
      .map(res=>res.json())
      .map(res => {
          console.log(res);
          if(res.code === 'DELETE-SUCCESS') {
            console.log("User deleted");

          }
          return res;
        })

    }

    public deleteRoom(room) {
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      return this.http.delete(`${this.serverApi}/home/${this.home_data._id}/room/${room._id}`,{headers})
      .map(res=>res.json())
      .map(res => {
          console.log(res);
          if(res.code === 'DELETE-SUCCESS') {
            console.log("Room deleted");

          }
          return res;
        })

    }

    public getAppliances(room) {
       let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      return this.http.get(`${this.serverApi}/home/${this.home_data._id}/room/${room._id}/appliance`,{headers})
        .map(res=>res.json())
        .map(res => {
          
          return res;
        })
    }

       public addAppliance(room, name: string, type: string, description: string, id: number) {
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      let body = JSON.stringify({appliance_name: name,appliance_type: type, appliance_description: description, appliance_id: id });
      return this.http.post(`${this.serverApi}/home/${this.home_data._id}/room/${room._id}/appliance`,body, {headers})
        .map(res => res.json())
        .map(res => {
          console.log(res);
          if(res.code === 'CREATE-SUCCESS') {
            console.log("SUccess");
          }
         return res;
       })

    }

     public deleteAppliance(room,appliance) {
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      return this.http.delete(`${this.serverApi}/home/${this.home_data._id}/room/${room._id}/appliance/${appliance._id}`,{headers})
      .map(res=>res.json())
      .map(res => {
          console.log(res);
          if(res.code === 'DELETE-SUCCESS') {
            console.log("Room deleted");

          }
          return res;
        })

    }

    public changeLightStatus(room,appliance,event) {
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('x-access-token', String(localStorage.getItem('auth_token')));
      let id= appliance.id;
      console.log("Hel");
      let event_state = 0;
      
      if(event) 
         event_state =1;
      else
        event_state =0;
      console.log(event_state);
              
      let body = JSON.stringify({ appliance_id: id,appliance_status: { state: event_state, read_state: event_state} });

      return this.http.put(`${this.serverApi}/home/${this.home_data._id}/room/${room._id}/appliance/${appliance._id}`,body, {headers})
        .map(res => res.json())
        .map(res => {
          console.log(res);
          if(res.code === 'UPDATE-SUCCESS') {
            console.log("SUccess");
          }
         return res;


      });

    }
  }
