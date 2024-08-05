import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { EnvService } from './env.service';
import { AlertService } from './alert.service';
@Injectable({
  providedIn: 'root'
})
export class PusherService {
  channel: any;
  user: any;
  private echo: Echo;
  message: any;
  appUrl: any;

  constructor(
		private env: EnvService,
    public alertService: AlertService
  ) {
    this.appUrl = this.env.API_URL.split(':8000/api')[0];
    // NB: For pusher
    this.echo = new Echo({
        broadcaster: 'pusher',
        key: 'f3fb618d8d467478dd77',
        cluster: 'eu',
        encrypted: true
    });

    // For Redis
    // this.echo = new Echo({
    //   broadcaster: 'redis',
    //   host: 'http://127.0.0.1',
    //   encrypted: false
    // });
  }

  public private(channel: string, event: string) {
    this.echo.private(channel).listen(event,
      (data: any) => {
        console.log(data);
        this.message = data.message;
        this.alertService.presentToast(this.message)
    })
  }

  public listen(channel: string, event: string) {
    this.echo.channel(channel).listen(event, (data: any)=>{
        this.message = data.message;
        console.log(data);
        this.alertService.presentToast(this.message)
    })
  }
}