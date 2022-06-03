import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocente } from '../docente.model';
import { DocenteService } from '../service/docente.service';

@Component({
  templateUrl: './docente-delete-dialog.component.html',
})
export class DocenteDeleteDialogComponent {
  docente?: IDocente;

  constructor(protected docenteService: DocenteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.docenteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
