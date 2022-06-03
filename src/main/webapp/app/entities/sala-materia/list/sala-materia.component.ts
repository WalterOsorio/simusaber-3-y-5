import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalaMateria } from '../sala-materia.model';
import { SalaMateriaService } from '../service/sala-materia.service';
import { SalaMateriaDeleteDialogComponent } from '../delete/sala-materia-delete-dialog.component';

@Component({
  selector: 'ss-35-sala-materia',
  templateUrl: './sala-materia.component.html',
})
export class SalaMateriaComponent implements OnInit {
  salaMaterias?: ISalaMateria[];
  isLoading = false;

  constructor(protected salaMateriaService: SalaMateriaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.salaMateriaService.query().subscribe({
      next: (res: HttpResponse<ISalaMateria[]>) => {
        this.isLoading = false;
        this.salaMaterias = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISalaMateria): number {
    return item.id!;
  }

  delete(salaMateria: ISalaMateria): void {
    const modalRef = this.modalService.open(SalaMateriaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.salaMateria = salaMateria;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
