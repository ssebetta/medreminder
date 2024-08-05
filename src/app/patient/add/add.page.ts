import { PatientService } from 'src/app/services/patient.service';
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
    private PatientService: PatientService,
    private navCtrl: NavController,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    ''
  }

  save(form: NgForm) {

    const formData = new FormData();
    
    formData.append('first_name', form.value.first_name);
    formData.append('last_name', form.value.last_name);
    formData.append('age', form.value.age);
    formData.append('gender', form.value.gender);
    formData.append('phone', form.value.phone);
    formData.append('email', form.value.email);
    formData.append('document_number', form.value.document_number);
    formData.append('address', form.value.address);
    formData.append('next_of_kin', form.value.next_of_kin);

    this.loading = true;
      this.PatientService.create(
          formData
      	).subscribe(
        (data: any) => {
          if(data.success){
            this.navCtrl.navigateRoot('/tabs/patients'); // Should navigate to my-foods page
            this.loading = false
          } else {
            this.alertService.presentToast("Failed to add patient. Check details");;
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
