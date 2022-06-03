import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEstudiante } from '../estudiante.model';

@Component({
  selector: 'ss-35-estudiante-detail',
  templateUrl: './estudiante-detail.component.html',
})
export class EstudianteDetailComponent implements OnInit {
  estudiante: IEstudiante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudiante }) => {
      this.estudiante = estudiante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
