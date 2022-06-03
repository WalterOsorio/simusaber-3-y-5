import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstudianteSala } from '../estudiante-sala.model';
import { EstudianteSalaService } from '../service/estudiante-sala.service';

@Component({
  templateUrl: './estudiante-sala-delete-dialog.component.html',
})
export class EstudianteSalaDeleteDialogComponent {
  estudianteSala?: IEstudianteSala;

  constructor(protected estudianteSalaService: EstudianteSalaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estudianteSalaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
