import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPrueba } from '../prueba.model';
import { PruebaService } from '../service/prueba.service';
import { PruebaDeleteDialogComponent } from '../delete/prueba-delete-dialog.component';

@Component({
  selector: 'ss-35-prueba',
  templateUrl: './prueba.component.html',
})
export class PruebaComponent implements OnInit {
  pruebas?: IPrueba[];
  isLoading = false;

  constructor(protected pruebaService: PruebaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pruebaService.query().subscribe({
      next: (res: HttpResponse<IPrueba[]>) => {
        this.isLoading = false;
        this.pruebas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPrueba): number {
    return item.id!;
  }

  delete(prueba: IPrueba): void {
    const modalRef = this.modalService.open(PruebaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.prueba = prueba;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
