import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPrueba } from '../prueba.model';

@Component({
  selector: 'ss-35-prueba-detail',
  templateUrl: './prueba-detail.component.html',
})
export class PruebaDetailComponent implements OnInit {
  prueba: IPrueba | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prueba }) => {
      this.prueba = prueba;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
