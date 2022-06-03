import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISala } from '../sala.model';

@Component({
  selector: 'ss-35-sala-detail',
  templateUrl: './sala-detail.component.html',
})
export class SalaDetailComponent implements OnInit {
  sala: ISala | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sala }) => {
      this.sala = sala;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
