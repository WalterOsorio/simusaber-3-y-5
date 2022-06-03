import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstudianteSala } from '../estudiante-sala.model';
import { EstudianteSalaService } from '../service/estudiante-sala.service';
import { EstudianteSalaDeleteDialogComponent } from '../delete/estudiante-sala-delete-dialog.component';

@Component({
  selector: 'ss-35-estudiante-sala',
  templateUrl: './estudiante-sala.component.html',
})
export class EstudianteSalaComponent implements OnInit {
  estudianteSalas?: IEstudianteSala[];
  isLoading = false;

  constructor(protected estudianteSalaService: EstudianteSalaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.estudianteSalaService.query().subscribe({
      next: (res: HttpResponse<IEstudianteSala[]>) => {
        this.isLoading = false;
        this.estudianteSalas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IEstudianteSala): number {
    return item.id!;
  }

  delete(estudianteSala: IEstudianteSala): void {
    const modalRef = this.modalService.open(EstudianteSalaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.estudianteSala = estudianteSala;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
