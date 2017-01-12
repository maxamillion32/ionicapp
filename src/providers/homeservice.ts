import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthService } from './authservice';
import { Home } from '../models/home'

@Injectable()
export class HomeService {
	private homes: Home[];
	private homeYet: Boolean = false;
 

	private serverApi= 'http://localhost:8080';

  constructor(public http: Http, private  authServ: AuthService) {
   
    console.log('Hello Homeservice Provider');
  }




  public getHome():Observable<Home[]> {
  	
  	let headers = new Headers;
  	headers.append('Content-Type', 'aapplication/json');
  	headers.append('x-access-token', String(localStorage.getItem('auth_token')));

  	return this.http.get(`${this.serverApi}/home`, {headers})
  	.map(res => res.json())
  	.map(res => {

  	    
  		if(res.user_data.type && res.homes.length>0) {

  				this.homeYet = true;
  		}
  		return res;
  	})
    .map(res => <Home[]>res.homes);
  }

  public deleteHome(id:string) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', String(localStorage.getItem('auth_token')));

    return this.http.delete(`${this.serverApi}/home/${id}`, {headers})
    .map(res => res.json())
    .map(res => {
     
      if(res.code ==='DELETE-SUCCESS')
        console.log("Deleted");
      return res;
    })
  }

  public editHome(id:string, home_name:string,home_description: string) {

     let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', String(localStorage.getItem('auth_token')));

    let body = JSON.stringify({name: home_name, description: home_description});
    
     return this.http.put(`${this.serverApi}/home/${id}`, body, {headers})
        .map(res => res.json())
        .map(res => {
        
          if(res.code ==='UPDATE-SUCCESS')
             console.log("Updated");
             return res;
    })
  }
  public createHome(home_name: string, home_description: string) {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', String(localStorage.getItem('auth_token')));
    let body = JSON.stringify({name: home_name, description: home_description});
    return this.http.post(`${this.serverApi}/home/`, body, {headers})
    .map(res => res.json())
    .map(res => { 
      console.log(res);
      if(String(res.code) === 'CREATE-SUCCESS')
         console.log("Created");
       return res;


    })
  }

  public viewHome(id: string) {
     let headers = new Headers;
     headers.append('Content-Type', 'aapplication/json');
     headers.append('x-access-token', String(localStorage.getItem('auth_token')));
    console.log(headers);
    return this.http.get(`${this.serverApi}/home/${id}`, {headers})
    .map(res => res.json());



  }
  
 
  

  public doesHaveAHome() {

  	return this.homeYet;
  }

}
