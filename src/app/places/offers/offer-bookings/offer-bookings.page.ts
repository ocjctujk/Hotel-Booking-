import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from 'src/app/shared/place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  id='';
  place: Place;
  constructor(private route: ActivatedRoute,private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(data=>{
      this.id = data.get('offerId');
      this.place = this.placesService.getPlace(this.id);
 
    })

  }

}
