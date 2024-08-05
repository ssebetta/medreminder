import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { PatientService } from 'src/app/services/patient.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  patient: any;
  loading: boolean = false;
  user: any;
  userId: any;
  role: any;
  comment: any;

  constructor(
		public router:Router,
    private route: ActivatedRoute,
    private PatientService: PatientService,
    private alertService: AlertService,
    private modalController: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.role = localStorage.getItem('role');
    this.userId = localStorage.getItem('user_id');

    let navigation: any = this.router.getCurrentNavigation();
    let state = navigation.extras.state;

    if (state) {
      this.patient = state.object;
    }
  }

  getpatient(id: any) {
    this.loading = true;
		this.PatientService.view(id)  
      .subscribe(
        (data: any) => {
          if(data.success){
            
            this.patient = data.patient
            this.loading = false
          } else {
            this.alertService.presentToast("Failed to get patient. Check details");;
            this.loading = false
          }
        },
        error => {
          this.alertService.presentToast(error);
          this.loading = false;
        },
        () => {
    
      }
    );
  }

  showAppointmentInput = false;
  appointmentDate: string = '';

  toggleAppointmentInput() {
    this.showAppointmentInput = !this.showAppointmentInput;
  }

  saveAppointment() {
    if (!this.appointmentDate) {
      this.alertService.presentToast("Select a date");
    }
    
    const formData = new FormData();
    
    formData.append('date', this.appointmentDate);
    formData.append('patient_id', this.patient.id);

    this.loading = true;
      this.PatientService.appointment(
          formData
      	).subscribe(
        (data: any) => {
          if(data.success){
            // this.navCtrl.navigateRoot('/tabs/patients');
            window.location.reload()
            this.loading = false
          } else {
            this.alertService.presentToast("Failed to add appointment. Check details");;
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

  showMedicationInput = false;
  medicationName: string = '';
  medicationTime: string = '';

  toggleMedicationInput() {
    this.showMedicationInput = !this.showMedicationInput;
  }

  saveMedication() {
    if (!this.medicationName) {
      this.alertService.presentToast("Enter a name");
    }
    if (!this.medicationTime) {
      this.alertService.presentToast("Select a time");
    }
    const formData = new FormData();
    
    formData.append('name', this.medicationName);
    formData.append('time', this.medicationTime);
    formData.append('patient_id', this.patient.id);

    this.loading = true;
    this.PatientService.medication(
          formData
      	).subscribe(
        (data: any) => {
          if(data.success){
            // this.navCtrl.navigateRoot('/tabs/patients');
            window.location.reload()
            this.loading = false
          } else {
            this.alertService.presentToast("Failed to add medication. Check details");;
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
  remindAppointment(item: any, patient: any) {
    this.loading = true
    let message = `Hello ${patient.name.split(' ')[0]}. This is a reminder about your doctor's appointment on ${item.date}`
    // alert(message)
    const formData = new FormData();
    formData.append('message', message);
    formData.append('phone', patient.phone);
    this.PatientService.reminder(
      formData
    ).subscribe(
      (data: any) => {
        if(data.success){
          this.alertService.presentToast("Reminder sent");
          this.loading = false
        } else {
          this.alertService.presentToast("Failed to send reminder.");
          this.loading = false  
        }
      },
      (error: any) => {
        this.alertService.presentToast("Something went wrong");
        
        this.loading = false;
      },
      () => {
        
      }
    );
  }
  remindMedication(item: any, patient: any) {
    this.loading = true
    let message = `Hello ${patient.name.split(' ')[0]}. Please remember to take your medication at ${item.time}`
    // alert(message)
    const formData = new FormData();
    formData.append('message', message);
    formData.append('phone', patient.phone);
    this.PatientService.reminder(
      formData
    ).subscribe(
      (data: any) => {
        if(data.success){
          this.alertService.presentToast("Reminder sent");
          this.loading = false
        } else {
          this.alertService.presentToast("Failed to send reminder.");
          this.loading = false  
        }
      },
      (error: any) => {
        this.alertService.presentToast("Something went wrong");
        
        this.loading = false;
      },
      () => {
        
      }
    );
  }
}
