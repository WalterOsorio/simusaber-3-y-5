import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPruebaApoyo } from '../prueba-apoyo.model';
import { PruebaApoyoService } from '../service/prueba-apoyo.service';

@Component({
  templateUrl: './prueba-apoyo-delete-dialog.component.html',
})
export class PruebaApoyoDeleteDialogComponent {
  pruebaApoyo?: IPruebaApoyo;

  constructor(protected pruebaApoyoService: PruebaApoyoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pruebaApoyoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
