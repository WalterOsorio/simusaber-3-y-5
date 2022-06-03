import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPruebaApoyo } from '../prueba-apoyo.model';
import { PruebaApoyoService } from '../service/prueba-apoyo.service';
import { PruebaApoyoDeleteDialogComponent } from '../delete/prueba-apoyo-delete-dialog.component';

@Component({
  selector: 'ss-35-prueba-apoyo',
  templateUrl: './prueba-apoyo.component.html',
})
export class PruebaApoyoComponent implements OnInit {
  pruebaApoyos?: IPruebaApoyo[];
  isLoading = false;

  constructor(protected pruebaApoyoService: PruebaApoyoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pruebaApoyoService.query().subscribe({
      next: (res: HttpResponse<IPruebaApoyo[]>) => {
        this.isLoading = false;
        this.pruebaApoyos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPruebaApoyo): number {
    return item.id!;
  }

  delete(pruebaApoyo: IPruebaApoyo): void {
    const modalRef = this.modalService.open(PruebaApoyoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pruebaApoyo = pruebaApoyo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
