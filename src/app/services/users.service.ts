import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { NavController } from '@ionic/angular';
import { EnvService } from './env.service';
import { Users } from '../models/users';
@Injectable({
  providedIn: 'root'
})

export class usersService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private navCtrl: NavController,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('medrem_token')}`
    })
  }

  create(
    form: any
  ) {
    return this.http.post(this.env.API_URL + 'users/add',
      form,
      {
        headers: new HttpHeaders({
          'Authorization': `${localStorage.getItem('medrem_token')}`
        })
      }
    )
  }

  fetch(currentPage: number) {
    return this.http.get<Users>(this.env.API_URL + 'users?page=' + currentPage, this.httpOptions)
  }

  view(id:any) {
    return this.http.get<Users>(this.env.API_URL + 'users/details/' + id, this.httpOptions)
  }

  edit(
    location: any,
    message: any,
    id:any
  ) {
    return this.http.post(this.env.API_URL + 'edit-users/',
      {
        location: location,
        message: message,
        id: id
      }
    )
  }

  delete() {
    return this.http.post<Users>(this.env.API_URL + 'delete-users', this.httpOptions)
      .pipe(
        tap(users => {
          this.navCtrl.navigateRoot('/users');
        })
      )
  }
}