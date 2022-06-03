import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMateria } from '../materia.model';
import { MateriaService } from '../service/materia.service';

@Component({
  templateUrl: './materia-delete-dialog.component.html',
})
export class MateriaDeleteDialogComponent {
  materia?: IMateria;

  constructor(protected materiaService: MateriaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.materiaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
