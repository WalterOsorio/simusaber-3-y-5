import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocenteMateria } from '../docente-materia.model';

@Component({
  selector: 'ss-35-docente-materia-detail',
  templateUrl: './docente-materia-detail.component.html',
})
export class DocenteMateriaDetailComponent implements OnInit {
  docenteMateria: IDocenteMateria | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ docenteMateria }) => {
      this.docenteMateria = docenteMateria;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
