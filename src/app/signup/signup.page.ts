import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SigninPage } from '../signin/signin.page';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  loading: boolean = false;
  countries: any;
  selectedCountry: any = {
    country_code: '',
    name: '',
    id: ''
  };
  constructor(private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
  ) { }

  ionViewWillEnter(){
  }

  toggleSelectedCountry(item: any) {
    this.selectedCountry = item
  }

  signup(form: NgForm) {
    if(form.value == "")
    {
      this.alertService.presentToast("Fill up required fields");
    } 
    else if(form.value.first_name == "")
    {
      this.alertService.presentToast("Please enter your first name");
    }
    else if(form.value.last_name == "")
    {
      this.alertService.presentToast("Please enter your last name");
    }
    else if(form.value.phone == "")
    {
      this.alertService.presentToast("Please enter your phone number");
    }
    // else if(form.value.email == "")
    // {
    //   this.alertService.presentToast("Please enter your email");
    // }
    else if(form.value.password == "")
    {
      this.alertService.presentToast("Please set a password");
    }
    else
    { 
      this.loading = true;
      this.authService.signup(
        form.value.first_name,
        form.value.last_name,
      	form.value.email,
        form.value.phone,
        form.value.password,
        form.value.country_id,
      	).subscribe(
        (data: any) => {
          if(data.success){
            localStorage.setItem('userId', data.user.id)
            localStorage.setItem('phone', data.user.phone)
            localStorage.setItem('xzwhkmx', data.xzwhkmx)

            this.alertService.presentToast('Signup successful');
            this.navCtrl.navigateRoot('/verify');
            this.loading = false
          } else {
            this.alertService.presentToast(data.error);
            this.loading = false
          }
        },
        error => {
          this.alertService.presentToast("Something went wrong");
          
          this.loading = false;
        },
        () => {
          
        }
      );
    }
  }
}