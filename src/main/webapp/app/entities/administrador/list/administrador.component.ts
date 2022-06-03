import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdministrador } from '../administrador.model';
import { AdministradorService } from '../service/administrador.service';
import { AdministradorDeleteDialogComponent } from '../delete/administrador-delete-dialog.component';

@Component({
  selector: 'ss-35-administrador',
  templateUrl: './administrador.component.html',
})
export class AdministradorComponent implements OnInit {
  administradors?: IAdministrador[];
  isLoading = false;

  constructor(protected administradorService: AdministradorService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.administradorService.query().subscribe({
      next: (res: HttpResponse<IAdministrador[]>) => {
        this.isLoading = false;
        this.administradors = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAdministrador): number {
    return item.id!;
  }

  delete(administrador: IAdministrador): void {
    const modalRef = this.modalService.open(AdministradorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.administrador = administrador;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
