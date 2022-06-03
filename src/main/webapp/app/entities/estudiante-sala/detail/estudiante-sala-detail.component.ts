import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEstudianteSala } from '../estudiante-sala.model';

@Component({
  selector: 'ss-35-estudiante-sala-detail',
  templateUrl: './estudiante-sala-detail.component.html',
})
export class EstudianteSalaDetailComponent implements OnInit {
  estudianteSala: IEstudianteSala | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudianteSala }) => {
      this.estudianteSala = estudianteSala;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
