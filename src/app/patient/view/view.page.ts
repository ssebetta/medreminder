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

  remindAppointment(item: any, patient: any) {

  }

  remindMedication(item: any, patient: any) {
    
  }

}
