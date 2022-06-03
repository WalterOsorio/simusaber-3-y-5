import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITipoDocumento } from '../tipo-documento.model';
import { TipoDocumentoService } from '../service/tipo-documento.service';
import { TipoDocumentoDeleteDialogComponent } from '../delete/tipo-documento-delete-dialog.component';

@Component({
  selector: 'ss-35-tipo-documento',
  templateUrl: './tipo-documento.component.html',
})
export class TipoDocumentoComponent implements OnInit {
  tipoDocumentos?: ITipoDocumento[];
  isLoading = false;

  constructor(protected tipoDocumentoService: TipoDocumentoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.tipoDocumentoService.query().subscribe({
      next: (res: HttpResponse<ITipoDocumento[]>) => {
        this.isLoading = false;
        this.tipoDocumentos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITipoDocumento): number {
    return item.id!;
  }

  delete(tipoDocumento: ITipoDocumento): void {
    const modalRef = this.modalService.open(TipoDocumentoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tipoDocumento = tipoDocumento;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
