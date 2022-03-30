import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[] = [];
  private bookingSub: Subscription;
  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.fetchBookings();
    this.loadedBookings = this.bookingService.bookings;
    this.bookingSub = this.bookingService.bookingChanged.subscribe(
      (booking) => {
        this.loadedBookings = booking;
      }
    );
  }
  onCancelBooking(id: string, slidingItem: IonItemSliding) {
    this.bookingService.removeBooking(id);
    console.log('Canceling ' + id);
    slidingItem.close();
  }

  ngOnDestroy(): void {
    this.bookingSub.unsubscribe();
  }
}
