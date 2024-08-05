// import { GoogleMap } from '@ionic-native/google-maps';
import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit  } from '@angular/core';
import { NavController, IonicSlides, InfiniteScrollCustomEvent } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

interface Pharmacy {
	name: string;
	lat: number;
	lng: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
	swiperModules = [IonicSlides]
	MainSlide = {
		initialSlide: 0,
		speed: 500,
		effect: "flip",
		autoplay: true,
		loop: true
	}
	latestFoods:any = [];
	latestFood:any = [];
	person:any={};
	isWebAdmin:any;
	loading: boolean = false;
	foods: any;
	appUrl: any;
	currentPage: number = 1;
	event: any;
	origin: any;
	// map!: GoogleMap;
	map!: google.maps.Map;
	directionsService!: google.maps.DirectionsService;
	directionsRenderer!: google.maps.DirectionsRenderer;

  	constructor(
		public navCtrl:NavController,
		// private env: EnvService,
		// private foodService: FoodService,
		// private alertService: AlertService,
		public router:Router,
		private http: HttpClient
  	) { }

	@ViewChild('map') mapRef!: ElementRef;
	apiKey: any = 'AIzaSyCQLlBBXjwA1sm-r4K44BDF2zj2DQLgduI';
	pharmacies: Pharmacy[] = [];
	currentPosition: { lat: number; lng: number } = { lat: 0, lng: 0 };

	ionViewWillEnter() {
		if(!localStorage.getItem('medrem_token')) {
			this.navCtrl.navigateRoot('/signin');
		}
	}

	ionViewDidEnter() {
		this.initMap();
	}

	ngOnInit() {
		// this.initMap();
		''
	}

	initMap() {
		const mapOptions: google.maps.MapOptions = {
		  center: { lat: -0.616887, lng: 30.657606 },
		  zoom: 18
		};
		this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
		this.directionsService = new google.maps.DirectionsService();
		this.directionsRenderer = new google.maps.DirectionsRenderer();
		this.directionsRenderer.setMap(this.map);
	  }
	
	  getDirections() {
		const destination = '-0.616887,30.657606';
		const origin = '-0.6135237037837884,30.656986026474662';
	
		const request: google.maps.DirectionsRequest = {
		  origin: origin,
		  destination: destination,
		  travelMode: google.maps.TravelMode.DRIVING
		};
	
		this.directionsService.route(request, (result, status) => {
		  if (status === 'OK') {
			this.directionsRenderer.setDirections(result);
		  } else {
			console.error('Directions request failed due to ' + status);
		  }
		});
	  }

	addFood() {
		this.router.navigate(['/add-food']);
	}
}
