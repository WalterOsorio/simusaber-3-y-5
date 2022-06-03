import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMateria } from '../materia.model';
import { MateriaService } from '../service/materia.service';
import { MateriaDeleteDialogComponent } from '../delete/materia-delete-dialog.component';

@Component({
  selector: 'ss-35-materia',
  templateUrl: './materia.component.html',
})
export class MateriaComponent implements OnInit {
  materias?: IMateria[];
  isLoading = false;

  constructor(protected materiaService: MateriaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.materiaService.query().subscribe({
      next: (res: HttpResponse<IMateria[]>) => {
        this.isLoading = false;
        this.materias = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IMateria): number {
    return item.id!;
  }

  delete(materia: IMateria): void {
    const modalRef = this.modalService.open(MateriaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.materia = materia;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
