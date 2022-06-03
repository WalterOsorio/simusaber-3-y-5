import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBancoPregunta } from '../banco-pregunta.model';
import { BancoPreguntaService } from '../service/banco-pregunta.service';
import { BancoPreguntaDeleteDialogComponent } from '../delete/banco-pregunta-delete-dialog.component';

@Component({
  selector: 'ss-35-banco-pregunta',
  templateUrl: './banco-pregunta.component.html',
})
export class BancoPreguntaComponent implements OnInit {
  bancoPreguntas?: IBancoPregunta[];
  isLoading = false;

  constructor(protected bancoPreguntaService: BancoPreguntaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bancoPreguntaService.query().subscribe({
      next: (res: HttpResponse<IBancoPregunta[]>) => {
        this.isLoading = false;
        this.bancoPreguntas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IBancoPregunta): number {
    return item.id!;
  }

  delete(bancoPregunta: IBancoPregunta): void {
    const modalRef = this.modalService.open(BancoPreguntaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bancoPregunta = bancoPregunta;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
