import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdministrador } from '../administrador.model';

@Component({
  selector: 'ss-35-administrador-detail',
  templateUrl: './administrador-detail.component.html',
})
export class AdministradorDetailComponent implements OnInit {
  administrador: IAdministrador | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ administrador }) => {
      this.administrador = administrador;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
