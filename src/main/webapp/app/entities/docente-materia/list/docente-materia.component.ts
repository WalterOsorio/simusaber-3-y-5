import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocenteMateria } from '../docente-materia.model';
import { DocenteMateriaService } from '../service/docente-materia.service';
import { DocenteMateriaDeleteDialogComponent } from '../delete/docente-materia-delete-dialog.component';

@Component({
  selector: 'ss-35-docente-materia',
  templateUrl: './docente-materia.component.html',
})
export class DocenteMateriaComponent implements OnInit {
  docenteMaterias?: IDocenteMateria[];
  isLoading = false;

  constructor(protected docenteMateriaService: DocenteMateriaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.docenteMateriaService.query().subscribe({
      next: (res: HttpResponse<IDocenteMateria[]>) => {
        this.isLoading = false;
        this.docenteMaterias = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDocenteMateria): number {
    return item.id!;
  }

  delete(docenteMateria: IDocenteMateria): void {
    const modalRef = this.modalService.open(DocenteMateriaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.docenteMateria = docenteMateria;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
