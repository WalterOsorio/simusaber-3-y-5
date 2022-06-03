import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdmiBancoP } from '../admi-banco-p.model';
import { AdmiBancoPService } from '../service/admi-banco-p.service';
import { AdmiBancoPDeleteDialogComponent } from '../delete/admi-banco-p-delete-dialog.component';

@Component({
  selector: 'ss-35-admi-banco-p',
  templateUrl: './admi-banco-p.component.html',
})
export class AdmiBancoPComponent implements OnInit {
  admiBancoPS?: IAdmiBancoP[];
  isLoading = false;

  constructor(protected admiBancoPService: AdmiBancoPService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.admiBancoPService.query().subscribe({
      next: (res: HttpResponse<IAdmiBancoP[]>) => {
        this.isLoading = false;
        this.admiBancoPS = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAdmiBancoP): number {
    return item.id!;
  }

  delete(admiBancoP: IAdmiBancoP): void {
    const modalRef = this.modalService.open(AdmiBancoPDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.admiBancoP = admiBancoP;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
