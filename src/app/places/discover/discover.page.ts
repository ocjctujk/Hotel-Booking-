import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Place } from 'src/app/shared/place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  places : Place[];

  constructor(private placesService : PlacesService) { }

  ngOnInit() {
    this.places = this.placesService.places; 
  }

  ionViewWillEnter(){
    
  }
  onFilterUpdate(event : Event){
    console.log((event as CustomEvent).detail);
  }

}
