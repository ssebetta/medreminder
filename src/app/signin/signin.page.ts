import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SignupPage } from '../signup/signup.page';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {
  form:any;
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
  ) {
  	
  }

  ionViewWillEnter() {
    if(localStorage.getItem('medrem_token')) {
      this.navCtrl.navigateRoot('/tabs/home');
    }
  // Verify if user is validated else take to verification page
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  signin(form: NgForm) {

  	if(form.value == "")
  	{
  		this.alertService.presentToast("Enter email");
  	} else if(form.value.email == "")
  	{
  		this.alertService.presentToast("Enter email");
  	}
  	else if(form.value.password == "")
  	{
  		this.alertService.presentToast("Enter password");
  	}
  	else
  	{
  		this.loading = true;
	    this.authService.signin(form.value.email, form.value.password).subscribe(
	    	(data: any) => {
	      		if (!data.success) 
		      	{
		      		const message = "Incorrect Email or Password"
		      		this.alertService.presentToast(message);
		      		this.loading = false;
		      	}
		      	else
		      	{
					localStorage.setItem('user', JSON.stringify(data.user))
					localStorage.setItem('user_id', data.user.id)
					localStorage.setItem('role', data.user.role)
					localStorage.setItem('medrem_token', data.access_token)
					this.navCtrl.navigateRoot('/tabs/home');
		      		this.alertService.presentToast("Logged in!");
              		window.location.reload();
		        	this.navCtrl.navigateRoot('/tabs/home');
		        	this.loading = false;
		      	}
			},
			error => {
				this.alertService.presentToast("Failed to connect");
			}
	    );
    }
  }
  logout()
  {
    this.authService.logout();
    this.navCtrl.navigateRoot('/signin');
  }
}