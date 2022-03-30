import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from '../shared/place.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public placesChanged = new Subject<Place[]>();
  isLoading = false;

  firebaseURL = 'https://hotel-booking-97098-default-rtdb.firebaseio.com/';
  private _places: Place[] = [
    // new Place(
    //   '1',
    //   'Hotel Taj',
    //   'The Taj Skyline, Sindhu Bhavan Marg, PRL Colony, Thaltej, Ahmedabad, Gujarat',
    //   'https://lh3.googleusercontent.com/p/AF1QipM2fjEObuuyvTql9Iog9C2IJ8EIOPc5_5Z9vOkZ=w296-h202-n-k-rw-no-v1',
    //   50.39,
    //   new Date('2022-01-01'),
    //   new Date('2022-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   '2',
    //   'Novotel',
    //   'Iscon Cross Roads, Sarkhej - Gandhinagar Hwy, Ahmedabad, Gujarat',
    //   'https://lh3.googleusercontent.com/proxy/9qXKSsfiIoCA3DE-4gKfZg_-btD1WRPQuW_oI0KNYNdt9-WvW8u4eqO_nzYY8w1HFy4aY4Uf3KosxRzt_3feXkl8i_O54kZFsDQZU3uL2-pMyihMj0gnqqG8RmbXze_XSroFtat2dAYWHQiOurNQVnOa1efrZ6Y=w296-h202-n-k-rw-no-v1',
    //   50.39,
    //   new Date('2022-01-01'),
    //   new Date('2022-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   '3',
    //   'Courtyard by Marriott',
    //   'Ramdev Nagar Cross Road, Satellite Rd, Ahmedabad, Gujarat 380015',
    //   'https://lh3.googleusercontent.com/p/AF1QipN2yt9OUGD-mGwBHPw90PteRd4jl1pb_gAoBVT7=w296-h202-n-k-rw-no-v1',
    //   50.39,
    //   new Date('2022-01-01'),
    //   new Date('2022-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   '4',
    //   'DoubleTree',
    //   'Ambli Rd, Vikram Nagar, Ahmedabad, Gujarat 380058',
    //   'https://lh3.googleusercontent.com/p/AF1QipP7MNc1VbaIioxN68y1KJpmOyNT13KC7IZbZLLS=w296-h202-n-k-rw-no-v1',
    //   50.39,
    //   new Date('2022-01-01'),
    //   new Date('2022-12-31'),
    //   'abc'
    // ),
  ];

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return [
      ...this.places.filter((place) => {
        return place.id === id;
      }),
    ][0];
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    let generateId = this.authService.userId;
  
    let newPlace = new Place(
      'id',
      title,
      description,
      'https://lh3.googleusercontent.com/p/AF1QipP7MNc1VbaIioxN68y1KJpmOyNT13KC7IZbZLLS=w296-h202-n-k-rw-no-v1',
      price,
      availableFrom,
      availableTo,
      generateId
    );
    this._places.push(newPlace);
    console.log(this._places);
    this.placesChanged.next(this._places);
    let token = this.authService.userId;  
    console.log(token);
    this.http
      .post<{ name: string }>(this.firebaseURL + 'offered-places.json' + '?auth=' +token, {
        ...newPlace,
        id: null
      })
      .subscribe(
        (data) => {
          console.log(data);
          newPlace.id = data.name;
          console.log(newPlace);
        },
        (error) => {
          alert(error.error.error.message);
        }
      );
  }

  updatePlace(placeId: string, newPlace: Place) {
    let place = this._places.filter((place) => {
      return place.id === placeId;
    })[0];
    place = newPlace;
    console.log(place);
    this.placesChanged.next(this._places);

    let token = this.authService.userId;  
    console.log(token);

    this.http
      .put(this.firebaseURL + 'offered-places/' + placeId + '.json' + '?auth=' +token, {
        ...newPlace,
        id: null
      })
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          alert(error.error.error.message);
        }
      );
    // this.putPlaces();
    // this.postData();
  }

  putPlaces() {
    let token = this.authService.userId;  
    console.log(token);
    this.http
      .put<Place[]>(this.firebaseURL + 'offered-places.json' + '?auth=' +token, {
        ...this._places,
        auth: token,
      })
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          alert(error.error.error.message);
        }
      );
  }

  fetchPlaces() {
    this.isLoading = true;
    let token = this.authService.userId;  
    console.log(token);
    this.http
      .get<{ [key: string]: PlaceData }>(
        this.firebaseURL + 'offered-places.json',
        {
          params: {
            auth: token,
          },
        }
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
        })
      )
      .subscribe(
        (data) => {
          this._places.splice(0, this._places.length);
          for (const el of data) {
            this._places.push(el);
          }
          this.placesChanged.next(this._places);
        },
        (error) => {
          console.log(error);
          alert(error.error.error);
        }
      );
  }
}
