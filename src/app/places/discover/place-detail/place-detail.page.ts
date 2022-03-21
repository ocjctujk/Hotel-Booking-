import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from 'src/app/shared/place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  id = '';
  place: Place;
  constructor(
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private actionCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('placeId');
    });
    this.place = this.placesService.getPlace(this.id);
  }

  onBookPlace() {
    this.actionCtrl
      .create({
        header: 'Choose an option',
        buttons: [
          {
            text: 'Select date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionEl) => {
        actionEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place },
      })
      .then((createEl) => {
        createEl.present();
        return createEl.onDidDismiss();
      })
      .then((eleData) => {
        console.log(eleData.data + eleData.role);
        if (eleData.role === 'confirm') {
          console.log('Booked !');
          console.log(eleData.data.message);
        }
      });
  }
}
