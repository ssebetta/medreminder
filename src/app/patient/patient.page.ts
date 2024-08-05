import { Component, OnInit } from '@angular/core';
import { NavController, InfiniteScrollCustomEvent, ModalController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { EnvService } from 'src/app/services/env.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.page.html',
  styleUrls: ['./patient.page.scss'],
})
export class PatientPage implements OnInit {
  
  loading: boolean = false;
  patients: any;
  mypatients: any;
  appUrl: any;
  role: any;
	currentPage: number = 1;

  constructor(private modalController: ModalController,
    private PatientService: PatientService,
    private navCtrl: NavController,
    private alertService: AlertService,
    public router:Router,
    public actionSheetCtrl: ActionSheetController,
    public env: EnvService
  ) { }

  ionViewWillEnter(){
    this.role = localStorage.getItem('role');
    this.fetchpatients()
  }

  ngOnInit() {
    this.appUrl = this.env.API_URL.split('api')[0] + 'storage/';
    this.role = localStorage.getItem('role')
  }

  fetchpatients() {
    {
      this.loading = true;
      this.PatientService.fetch(this.currentPage)
      .subscribe(
        (data: any) => {
          if(data.success){
            this.patients = data.patient.data
            this.loading = false
          } else {
            this.alertService.presentToast("Failed to add record. Check details");;
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
  }

  onIonInfinite(ev: any) {
		this.currentPage++
		this.PatientService.fetch(this.currentPage)
		.subscribe(
			(data: any) => {
				if(data.success) {
					this.patients = this.patients.concat(data.patient.data);
					this.currentPage = data.patient.current_page;
					(ev as InfiniteScrollCustomEvent).target.complete();

					if (this.currentPage === data.patient.last_page) {
						(ev as InfiniteScrollCustomEvent).target.disabled = true;
					}
				} else {
					this.alertService.presentToast(data.error);
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

  view(item: { id: number; })
  {
    // this.router.navigate(['/patient/view/' + item.id], {
    //   state: { object: JSON.stringify(item) }
    // });
    this.router.navigateByUrl('/patient/view', { state: { object: item } });
  }
  
  timeSince(date: any) {
    let now: any = new Date()
    let selectedDate: any = new Date(date)
    
    var seconds = Math.floor((now - selectedDate) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
}
