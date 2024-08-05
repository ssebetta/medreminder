import { usersService } from 'src/app/services/users.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  loading: boolean = false;

  constructor(
    private modalController: ModalController,
    private usersService: usersService,
    private navCtrl: NavController,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    ''
  }

  save(form: NgForm) {

    if(form.value.first_name === '') {
      this.alertService.presentToast("Enter First name");
    } else if(form.value.last_name === '') {
      this.alertService.presentToast("Enter Last name");
    } else if(form.value.email === '') {
      this.alertService.presentToast("Enter Email");
    } else if(form.value.role === '') {
      this.alertService.presentToast("Select a role");
    } else {
      const formData = new FormData();
      formData.append('first_name', form.value.first_name);
      formData.append('last_name', form.value.last_name);
      formData.append('email', form.value.email);
      formData.append('role', form.value.role);

      this.loading = true;
      this.usersService.create(
          formData
        ).subscribe(
        (data: any) => {
          if(data.success){
            this.navCtrl.navigateRoot('users'); // Should navigate to my-foods page
            this.loading = false
          } else {
            // this.alertService.presentToast("Failed to add record. Check details");;
            this.alertService.presentToast("Failed to add user. Check details");
            this.loading = false  
          }
        },
        error => {
          // this.alertService.presentToast(error);
          this.alertService.presentToast("Something went wrong");
          
          this.loading = false;
        },
        () => {
          
        }
      ); 
    }
  }
}
