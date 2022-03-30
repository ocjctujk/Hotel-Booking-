import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from 'src/app/shared/place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  id = '';
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((data) => {
      if (!data.has('offerId')) {
        return;
      }
    
      this.id = data.get('offerId');
    });

    this.form = new FormGroup({
      title: new FormControl(this.placeService.getPlace(this.id).title, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(
        this.placeService.getPlace(this.id).description,
        {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)],
        }
      ),
      price: new FormControl(this.placeService.getPlace(this.id).price, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
    });
  }
  onEditOffer() {
    console.log(this.form.value);
    let place: Place =this.placeService.getPlace(this.id);
    place.title = this.form.value.title;
    place.description = this.form.value.description;
    place.price = this.form.value.price;
    this.placeService.updatePlace(this.id,place);
    this.form.reset();
    this.router.navigate(['places','tabs','offers']);
  }
}
