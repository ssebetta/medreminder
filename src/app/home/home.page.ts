// import { GoogleMap } from '@ionic-native/google-maps';
import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild, OnInit  } from '@angular/core';
import { NavController, IonicSlides, InfiniteScrollCustomEvent } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { GoogleMap } from '@capacitor/google-maps';
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
	map!: GoogleMap;

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

	ionViewWillEnter() {
		if(!localStorage.getItem('medrem_token')) {
			this.navCtrl.navigateRoot('/tabs/signin');
		}
	}

	ngOnInit() {
		console.log('hi');
	}

	async ionViewDidEnter() {
		await this.createMap();
		await this.findNearbyPharmacies();
	}

	// async createMap() {
	// 	const coordinates = {coords: {latitude: -0.6042, longitude: 30.6583;}} //await Geolocation.getCurrentPosition();
	// 	this.map = await GoogleMap.create({
	// 	  id: 'my-map',
	// 	  element: this.mapRef.nativeElement,
	// 	  apiKey: this.apiKey,
	// 	  config: {
	// 		center: {
	// 		  lat: coordinates.coords.latitude,
	// 		  lng: coordinates.coords.longitude,
	// 		},
	// 		zoom: 14,
	// 	  },
	// 	});
	// }

	async createMap() {
		try {
		  // Request permissions
		//   const permissionStatus = await Geolocation.checkPermissions();
		//   if (permissionStatus.location === 'prompt' || permissionStatus.location === 'prompt-with-rationale') {
		// 	await Geolocation.requestPermissions();
		//   }
	
		//   const coordinates = await Geolocation.getCurrentPosition({
		// 	enableHighAccuracy: true,
		// 	timeout: 30000 // 30 seconds timeout
		//   });
		  
		  this.map = await GoogleMap.create({
			id: 'my-map',
			element: this.mapRef.nativeElement,
			apiKey: this.apiKey,
			config: {
			  center: {
				// lat: coordinates.coords.latitude,
				// lng: coordinates.coords.longitude,
				lat: -0.6042,
				lng: 30.6583
			  },
			  zoom: 14,
			},
		  });
		} catch (error) {
		  console.error('Error creating map:', error);
		  // Handle the error appropriately, maybe show a message to the user
		}
	  }
	
	  async findNearbyPharmacies() {
		const coordinates = {coords: {latitude: -0.6042, longitude: 30.6583}} //await Geolocation.getCurrentPosition();
		this.pharmacies = await this.searchNearbyPharmacies(coordinates.coords.latitude, coordinates.coords.longitude);
		
		for (const pharmacy of this.pharmacies) {
		  await this.map.addMarker({
			coordinate: {
			  lat: pharmacy.lat,
			  lng: pharmacy.lng,
			},
			title: pharmacy.name,
		  });
		}
	  }
	
	  async searchNearbyPharmacies(lat: number, lng: number): Promise<Pharmacy[]> {
		const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=pharmacy&key=${this.apiKey}`;
		
		return new Promise((resolve, reject) => {
		  this.http.get(url).subscribe(
			(data: any) => {
			  const pharmacies = data.results.map((result: any) => ({
				name: result.name,
				lat: result.geometry.location.lat,
				lng: result.geometry.location.lng
			  }));
			  resolve(pharmacies);
			},
			error => {
			  console.error('Error fetching pharmacies:', error);
			  reject(error);
			}
		  );
		});
	  }
	
	  async showRoute(destination: Pharmacy) {
		const origin = {coords: {latitude: -0.6042, longitude: 30.6583}} //await Geolocation.getCurrentPosition();
		const route = await this.getRoute(
		  { lat: origin.coords.latitude, lng: origin.coords.longitude },
		  { lat: destination.lat, lng: destination.lng }
		);
	
		await this.map.addPolylines([
		  {
			path: route,
			strokeColor: '#4285F4',
			strokeOpacity: 1.0,
          	strokeWeight: 3,
		  },
		]);
	  }
	
	  async getRoute(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<{ lat: number; lng: number }[]> {
		const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${this.apiKey}`;
		
		return new Promise((resolve, reject) => {
		  this.http.get(url).subscribe(
			(data: any) => {
			  const route = data.routes[0].overview_path.map((point: any) => ({
				lat: point.lat,
				lng: point.lng
			  }));
			  resolve(route);
			},
			error => {
			  console.error('Error fetching route:', error);
			  reject(error);
			}
		  );
		});
	  }

	// async loadMap() {
	// 	const mapOptions = {
	// 		center: { lat: 0.3476, lng: 32.5825 }, // Kampala, Uganda
	// 		zoom: 12,
	// 	};
	
	// 	this.map = await GoogleMap.create('map_canvas', mapOptions);
	
	// 	this.map.setOnMarkerClickListener((marker: any) => {
	// 	  const lat = marker.getPosition().lat;
	// 	  const lng = marker.getPosition().lng;
	// 	  this.calculateDistance(lat, lng);
	// 	});
	
	// 	this.getCurrentLocation();
	//   }
	
	//   getCurrentLocation() {
	// 	navigator.geolocation.getCurrentPosition(
	// 	  (position) => {
	// 		this.map.setCamera({
	// 		  target: {
	// 			lat: position.coords.latitude,
	// 			lng: position.coords.longitude,
	// 		  },
	// 		  zoom: 15,
	// 		});
	// 		this.fetchNearbyPlaces(position.coords.latitude, position.coords.longitude);
	// 	  },
	// 	  (error) => {
	// 		console.error('Error getting location', error);
	// 	  },
	// 	  { enableHighAccuracy: true }
	// 	);
	//   }
	
	//   fetchNearbyPlaces(lat: number, lng: number) {
	// 	const apiKey = 'AIzaSyCQLlBBXjwA1sm-r4K44BDF2zj2DQLgduI';
	// 	const radius = 5000; // 5 km
	// 	const type = 'pharmacy';
	// 	const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
	
	// 	this.http.get(url).subscribe((data: any) => {
	// 	  data.results.forEach((place: any) => {
	// 		this.map.addMarker({
	// 		  position: {
	// 			lat: place.geometry.location.lat,
	// 			lng: place.geometry.location.lng,
	// 		  },
	// 		  title: place.name,
	// 		});
	// 	  });
	// 	});
	//   }
	
	//   calculateDistance(destLat: number, destLng: number) {
	// 	const apiKey = 'AIzaSyCQLlBBXjwA1sm-r4K44BDF2zj2DQLgduI';
	// 	const origin = `${this.map.getCameraPosition().target.lat},${this.map.getCameraPosition().target.lng}`;
	// 	const destination = `${destLat},${destLng}`;
	// 	const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
	
	// 	this.http.get(url).subscribe((data: any) => {
	// 	  const distance = data.rows[0].elements[0].distance.text;
	// 	  const duration = data.rows[0].elements[0].duration.text;
	// 	  alert(`Distance: ${distance}, Duration: ${duration}`);
	// 	});
	//   }

	addFood() {
		this.router.navigate(['/add-food']);
	}
}
