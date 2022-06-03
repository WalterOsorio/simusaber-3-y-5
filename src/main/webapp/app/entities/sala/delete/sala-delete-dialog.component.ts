import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISala } from '../sala.model';
import { SalaService } from '../service/sala.service';

@Component({
  templateUrl: './sala-delete-dialog.component.html',
})
export class SalaDeleteDialogComponent {
  sala?: ISala;

  constructor(protected salaService: SalaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.salaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
