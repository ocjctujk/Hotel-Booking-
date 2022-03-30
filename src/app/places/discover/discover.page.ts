import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, SegmentChangeEventDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from 'src/app/shared/place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  placesSubscription: Subscription;
  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesService.fetchPlaces();
    this.placesSubscription = this.placesService.placesChanged.subscribe(
      (places) => {
        this.filteredPlaces = [...places];
        this.places = [...places];
      }
    );
  }

  onFilterUpdate(event: Event) {
    console.log((event as CustomEvent).detail.value);
    let generateId = this.authService.userId;
    if ((event as CustomEvent).detail.value === 'all') {
      this.filteredPlaces = this.places;
    } else if ((event as CustomEvent).detail.value === 'bookable') {
      this.filteredPlaces = this.places.filter((place) => {
        return place.userId !== generateId;
      });
    } else {
    }
  }

  ngOnDestroy(): void {
    this.placesSubscription.unsubscribe();
  }
}
