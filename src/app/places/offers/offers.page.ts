import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from 'src/app/shared/place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];
  offerSubscription: Subscription;
  constructor(private placesService: PlacesService) {}

  ngOnInit() {
    this.placesService.fetchPlaces();
    this.offerSubscription = this.placesService.placesChanged.subscribe(
      (places) => {
        this.offers = [...places];
      }
    );
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  ngOnDestroy(): void {
    this.offerSubscription.unsubscribe();
  }
  ionViewWillEnter() {}
}
