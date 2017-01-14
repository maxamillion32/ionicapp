import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ShareService {  
  
    private room_data: any;
 
    constructor() {
        this.room_data = "null";
    }
  
    setRoomData(data) {
        this.room_data= data;
          
    }
  
    getRoomData() {
        return this.room_data;
    }   
}