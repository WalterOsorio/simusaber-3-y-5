import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISalaMateria } from '../sala-materia.model';

@Component({
  selector: 'ss-35-sala-materia-detail',
  templateUrl: './sala-materia-detail.component.html',
})
export class SalaMateriaDetailComponent implements OnInit {
  salaMateria: ISalaMateria | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salaMateria }) => {
      this.salaMateria = salaMateria;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
