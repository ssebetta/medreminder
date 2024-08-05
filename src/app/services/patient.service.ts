import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { NavController } from '@ionic/angular';
import { EnvService } from './env.service';
import { Patient } from '../models/patient';
@Injectable({
  providedIn: 'root'
})

export class PatientService {
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
    return this.http.post(this.env.API_URL + 'patient/add',
      form,
      {
        headers: new HttpHeaders({
          'Authorization': `${localStorage.getItem('medrem_token')}`
        })
      }
    )
  }

  appointment(
    form: any
  ) {
    return this.http.post(this.env.API_URL + 'appointment/add',
      form,
      {
        headers: new HttpHeaders({
          'Authorization': `${localStorage.getItem('medrem_token')}`
        })
      }
    )
  }

  medication(
    form: any
  ) {
    return this.http.post(this.env.API_URL + 'medication/add',
      form,
      {
        headers: new HttpHeaders({
          'Authorization': `${localStorage.getItem('medrem_token')}`
        })
      }
    )
  }

  fetch(currentPage: number) {
    return this.http.get<Patient>(this.env.API_URL + 'patients?page=' + currentPage, this.httpOptions)
  }

  view(id:any) {
    return this.http.get<Patient>(this.env.API_URL + 'patient/details/' + id, this.httpOptions)
  }

  edit(
    location: any,
    message: any,
    id:any
  ) {
    return this.http.post(this.env.API_URL + 'edit-patient/',
      {
        location: location,
        message: message,
        id: id
      }
    )
  }

  delete() {
    return this.http.post<Patient>(this.env.API_URL + 'delete-patient', this.httpOptions)
      .pipe(
        tap(patient => {
          this.navCtrl.navigateRoot('/patient');
        })
      )
  }
}