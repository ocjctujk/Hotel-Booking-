import { Injectable } from '@angular/core';
import { Place } from '../shared/place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      '1',
      'Hotel Taj',
      'The Taj Skyline, Sindhu Bhavan Marg, PRL Colony, Thaltej, Ahmedabad, Gujarat',
      'https://lh3.googleusercontent.com/p/AF1QipM2fjEObuuyvTql9Iog9C2IJ8EIOPc5_5Z9vOkZ=w296-h202-n-k-rw-no-v1',
      50.39
    ),
    new Place(
      '2',
      'Novotel',
      'Iscon Cross Roads, Sarkhej - Gandhinagar Hwy, Ahmedabad, Gujarat',
      'https://lh3.googleusercontent.com/proxy/9qXKSsfiIoCA3DE-4gKfZg_-btD1WRPQuW_oI0KNYNdt9-WvW8u4eqO_nzYY8w1HFy4aY4Uf3KosxRzt_3feXkl8i_O54kZFsDQZU3uL2-pMyihMj0gnqqG8RmbXze_XSroFtat2dAYWHQiOurNQVnOa1efrZ6Y=w296-h202-n-k-rw-no-v1',
      50.39
    ),
    new Place(
      '3',
      'Courtyard by Marriott',
      'Ramdev Nagar Cross Road, Satellite Rd, Ahmedabad, Gujarat 380015',
      'https://lh3.googleusercontent.com/p/AF1QipN2yt9OUGD-mGwBHPw90PteRd4jl1pb_gAoBVT7=w296-h202-n-k-rw-no-v1',
      50.39
    ),
    new Place(
      '4',
      'DoubleTree',
      'Ambli Rd, Vikram Nagar, Ahmedabad, Gujarat 380058',
      'https://lh3.googleusercontent.com/p/AF1QipP7MNc1VbaIioxN68y1KJpmOyNT13KC7IZbZLLS=w296-h202-n-k-rw-no-v1',
      50.39
    ),
  ];

  constructor() {}

  get places() {
    return [...this._places];
  }

  getPlace(id: string){
    return [...this.places.filter((place)=>{
      return place.id === id;
    })][0];
  }
}
