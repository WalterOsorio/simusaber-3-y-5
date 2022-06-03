import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocente } from '../docente.model';
import { DocenteService } from '../service/docente.service';
import { DocenteDeleteDialogComponent } from '../delete/docente-delete-dialog.component';

@Component({
  selector: 'ss-35-docente',
  templateUrl: './docente.component.html',
})
export class DocenteComponent implements OnInit {
  docentes?: IDocente[];
  isLoading = false;

  constructor(protected docenteService: DocenteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.docenteService.query().subscribe({
      next: (res: HttpResponse<IDocente[]>) => {
        this.isLoading = false;
        this.docentes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDocente): number {
    return item.id!;
  }

  delete(docente: IDocente): void {
    const modalRef = this.modalService.open(DocenteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.docente = docente;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
