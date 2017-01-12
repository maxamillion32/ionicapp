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
  private serverApi= 'http://localhost:8080';
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
          if(res.code === 'ADD-SUCCESS') {
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
  }
