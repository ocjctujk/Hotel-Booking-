import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor() {}

  bookings: Booking[] = [
    {
      id: 'b1',
      placeId: '1',
      userId: 'u1',
      placeTitle: 'Place 1',
      guestNumber: '5',
    },
    {
      id: 'b1',
      placeId: '1',
      userId: 'u1',
      placeTitle: 'Place 1',
      guestNumber: '5',
    },
    {
      id: 'b1',
      placeId: '1',
      userId: 'u1',
      placeTitle: 'Place 1',
      guestNumber: '5',
    },
  ];
}
