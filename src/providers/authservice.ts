import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Response } from '../models/response';

@Injectable()
export class AuthService {
	private loggedIn: Boolean = false;
	private serverApi= 'http://localhost:8080';

  constructor(public http: Http) {
  	this.loggedIn = 	!!localStorage.getItem('aut_token');
  }

  public login(credentials) {
  	let headers = new Headers;
  	headers.append('Content-Type', 'application/json');

  	if(credentials.email == null || credentials.password == null) {
  		return Observable.throw("The credentials can't be left empty");
  	}
  	else {
  	return this.http.post(`${this.serverApi}/a/signin`,JSON.stringify({email:credentials.email, password: credentials.password}),{headers})
  	  .map(res=> res.json())
      .map(res => {
      		if(res.type && res.token) {
      			localStorage.setItem('auth_token',res.token);

      			this.loggedIn = true;
      		
      		}
      		return res;
      });

  		}
  }

  public isLoggedIn() {
  	if(this.loggedIn || localStorage.getItem('auth_token')) {
      return this.loggedIn = true;
    }
    else 
      return this.loggedIn;
  }

  public getUserInfo() {

  }
}




