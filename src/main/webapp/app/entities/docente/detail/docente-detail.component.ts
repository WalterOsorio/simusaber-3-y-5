import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocente } from '../docente.model';

@Component({
  selector: 'ss-35-docente-detail',
  templateUrl: './docente-detail.component.html',
})
export class DocenteDetailComponent implements OnInit {
  docente: IDocente | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ docente }) => {
      this.docente = docente;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
