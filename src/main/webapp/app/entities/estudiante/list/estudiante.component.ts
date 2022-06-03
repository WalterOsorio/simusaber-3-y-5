import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstudiante } from '../estudiante.model';
import { EstudianteService } from '../service/estudiante.service';
import { EstudianteDeleteDialogComponent } from '../delete/estudiante-delete-dialog.component';

@Component({
  selector: 'ss-35-estudiante',
  templateUrl: './estudiante.component.html',
})
export class EstudianteComponent implements OnInit {
  estudiantes?: IEstudiante[];
  isLoading = false;

  constructor(protected estudianteService: EstudianteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.estudianteService.query().subscribe({
      next: (res: HttpResponse<IEstudiante[]>) => {
        this.isLoading = false;
        this.estudiantes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IEstudiante): number {
    return item.id!;
  }

  delete(estudiante: IEstudiante): void {
    const modalRef = this.modalService.open(EstudianteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.estudiante = estudiante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
