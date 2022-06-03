import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPruebaApoyo } from '../prueba-apoyo.model';

@Component({
  selector: 'ss-35-prueba-apoyo-detail',
  templateUrl: './prueba-apoyo-detail.component.html',
})
export class PruebaApoyoDetailComponent implements OnInit {
  pruebaApoyo: IPruebaApoyo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pruebaApoyo }) => {
      this.pruebaApoyo = pruebaApoyo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
