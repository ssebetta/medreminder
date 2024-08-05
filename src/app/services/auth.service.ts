import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { NavController } from '@ionic/angular';
import { EnvService } from './env.service';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn = false;
  user:any;
  id:any;
  name:any;
  role:any;
  token:any;
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private navCtrl: NavController,
  ) { }
  //http options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('medrem_token')}`
    })
  }

  signin(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'login',
      {email: email, password: password}
    )
  }

  verify(phone: any, otp: Number, userId: any, xzwhkmx: any) {
    return this.http.post(this.env.API_URL + 'verify_otp',
      {msisdn: phone, otp: otp, user_id: parseInt(userId), xzwhkmx: xzwhkmx}
    )
  }

  signup(
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    password: String,
    country_id: String,
  ) {
    return this.http.post(this.env.API_URL + 'register',
      {
        email: email, 
        phone: phone,
        first_name: first_name,
        last_name: last_name,
        password: password,
        country_id: country_id
      }
    )
  }

  logout() {
    return this.http.get<User>(this.env.API_URL + 'auth/logout', this.httpOptions)
  }
  
  getUser() {
    return this.http.get<User>(this.env.API_URL + 'auth/me', this.httpOptions)
  }

  getNotifs() {
    return this.http.get<User>(this.env.API_URL + 'auth/notifs', this.httpOptions)
  }

  markAsRead(id: any) {
    return this.http.post<User>(this.env.API_URL + 'auth/mark-as-read', 
    {
      id: id
    }, this.httpOptions)
  }
}