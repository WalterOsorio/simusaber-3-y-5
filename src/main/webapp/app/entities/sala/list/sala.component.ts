import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISala } from '../sala.model';
import { SalaService } from '../service/sala.service';
import { SalaDeleteDialogComponent } from '../delete/sala-delete-dialog.component';

@Component({
  selector: 'ss-35-sala',
  templateUrl: './sala.component.html',
})
export class SalaComponent implements OnInit {
  salas?: ISala[];
  isLoading = false;

  constructor(protected salaService: SalaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.salaService.query().subscribe({
      next: (res: HttpResponse<ISala[]>) => {
        this.isLoading = false;
        this.salas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISala): number {
    return item.id!;
  }

  delete(sala: ISala): void {
    const modalRef = this.modalService.open(SalaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sala = sala;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
