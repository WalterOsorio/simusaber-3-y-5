import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalaMateria } from '../sala-materia.model';
import { SalaMateriaService } from '../service/sala-materia.service';

@Component({
  templateUrl: './sala-materia-delete-dialog.component.html',
})
export class SalaMateriaDeleteDialogComponent {
  salaMateria?: ISalaMateria;

  constructor(protected salaMateriaService: SalaMateriaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.salaMateriaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
