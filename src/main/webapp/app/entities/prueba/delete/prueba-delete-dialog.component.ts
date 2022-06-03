import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPrueba } from '../prueba.model';
import { PruebaService } from '../service/prueba.service';

@Component({
  templateUrl: './prueba-delete-dialog.component.html',
})
export class PruebaDeleteDialogComponent {
  prueba?: IPrueba;

  constructor(protected pruebaService: PruebaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pruebaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
