import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBancoPregunta } from '../banco-pregunta.model';
import { BancoPreguntaService } from '../service/banco-pregunta.service';

@Component({
  templateUrl: './banco-pregunta-delete-dialog.component.html',
})
export class BancoPreguntaDeleteDialogComponent {
  bancoPregunta?: IBancoPregunta;

  constructor(protected bancoPreguntaService: BancoPreguntaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bancoPreguntaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
