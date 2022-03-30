import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Place } from 'src/app/shared/place.model';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @ViewChild('form') form;
  dateValue = '';
  dateValue2 = '';
  dateFrom = new Date();
  dateTo = new Date();

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private bookingService: BookingService
  ) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBook(form: NgForm) {
    if (!form.valid) {
      return;
    }
    // this.toastCtrl
    //   .create({
    //     message: 'Booking Confirmed!',
    //     duration: 3000,
    //   })
    //   .then((toastEl) => {
    //     toastEl.present();
    //   });
    console.log(form.value);
    this.bookingService.addBooking(
      this.selectedPlace.id,
      this.selectedPlace.title,
      this.selectedPlace.imageUrl,
      form.value.firstName,
      form.value.lastName,
      form.value.guestNumber,
      this.dateFrom,
      this.dateTo
    );
    this.modalCtrl.dismiss({ message: 'Booking done' }, 'confirm');
  }

  formatDate(value: string, mode: string) {
    console.log(value);
    if (mode === 'from') {
      this.dateFrom = new Date(value);
    } else {
      this.dateTo = new Date(value);
    }
    return format(parseISO(value), 'MMM dd yyyy');
  }
}
