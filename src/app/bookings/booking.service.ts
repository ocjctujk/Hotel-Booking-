import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { PlacesPage } from '../places/places.page';
import { Booking } from './booking.model';
import { take, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface BookingData {
  placeId: string,
  userId: string,
  firstName:string,
  lastName: string,
  placeTitle: string,
  guestNumber: number,
  bookedFrom: string,
  bookedTo: string
}


@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private authService: AuthService, private http: HttpClient) {}
  bookingChanged = new Subject<Booking[]>();
  private _bookings: Booking[] = [];
  firebaseURL = 'https://hotel-booking-97098-default-rtdb.firebaseio.com/';

  get bookings() {
    return this._bookings;
  }
  getBooking(id: string) {
    return [
      ...this._bookings.filter((place) => {
        return place.id === id;
      }),
    ][0];
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      firstName,
      lastName,
      placeTitle,
      guestNumber,
      dateFrom,
      dateTo
    );
    console.log(newBooking);
    this._bookings.push(newBooking);
    this.bookingChanged.next(this._bookings);
    this.http
      .post<{ name: string }>(this.firebaseURL + 'bookings.json', {
        ...newBooking,
        id: null,
      })
      .subscribe((data) => {
        console.log(data);
        newBooking.id = data.name;
      });
  }

  removeBooking(id: string) {
    this._bookings = this._bookings.filter((place) => {
      return place.id !== id;
    });
    this.bookingChanged.next(this._bookings);
    this.http
      .delete(this.firebaseURL + 'bookings/' + id + '.json')
      .subscribe((data) => {
        console.log(data);
      });
  }


  fetchBookings(){
    this.http
      .get<{ [key: string]: BookingData }>(
        this.firebaseURL + `bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map((resData) => {
          const bookings = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  key,
                  resData[key].placeId,
                  resData[key].userId,
                  resData[key].firstName,
                  resData[key].lastName,
                  resData[key].placeTitle,
                  resData[key].guestNumber,
                  new Date(resData[key].bookedFrom),
                  new Date(resData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
        })
      )
      .subscribe(
        (data) => {
          this._bookings.splice(0, this._bookings.length);
          for (const el of data) {
            this._bookings.push(el);
          }
          this.bookingChanged.next(this._bookings);
        },
        (error) => {
          console.log(error);
         alert(error.error.error);
        }
      );
  }
}
