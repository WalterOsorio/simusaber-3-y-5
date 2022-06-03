import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdmiBancoP } from '../admi-banco-p.model';
import { AdmiBancoPService } from '../service/admi-banco-p.service';

@Component({
  templateUrl: './admi-banco-p-delete-dialog.component.html',
})
export class AdmiBancoPDeleteDialogComponent {
  admiBancoP?: IAdmiBancoP;

  constructor(protected admiBancoPService: AdmiBancoPService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.admiBancoPService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
