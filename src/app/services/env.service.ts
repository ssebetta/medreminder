import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EnvService {
	/*Live deploy: uncomment this before build*/
  // API_URL = 'http://silverms.com/api/';
  
  //Localhost
  API_URL = 'http://127.0.0.1:8000/api/';
  constructor() { }
}