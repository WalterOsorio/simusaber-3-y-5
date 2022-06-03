import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdmiBancoP } from '../admi-banco-p.model';

@Component({
  selector: 'ss-35-admi-banco-p-detail',
  templateUrl: './admi-banco-p-detail.component.html',
})
export class AdmiBancoPDetailComponent implements OnInit {
  admiBancoP: IAdmiBancoP | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ admiBancoP }) => {
      this.admiBancoP = admiBancoP;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
