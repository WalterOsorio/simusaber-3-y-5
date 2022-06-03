import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMateria } from '../materia.model';

@Component({
  selector: 'ss-35-materia-detail',
  templateUrl: './materia-detail.component.html',
})
export class MateriaDetailComponent implements OnInit {
  materia: IMateria | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ materia }) => {
      this.materia = materia;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
