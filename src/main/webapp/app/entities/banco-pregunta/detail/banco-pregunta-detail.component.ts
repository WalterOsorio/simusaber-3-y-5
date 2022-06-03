import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBancoPregunta } from '../banco-pregunta.model';

@Component({
  selector: 'ss-35-banco-pregunta-detail',
  templateUrl: './banco-pregunta-detail.component.html',
})
export class BancoPreguntaDetailComponent implements OnInit {
  bancoPregunta: IBancoPregunta | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bancoPregunta }) => {
      this.bancoPregunta = bancoPregunta;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
