import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocenteMateria } from '../docente-materia.model';
import { DocenteMateriaService } from '../service/docente-materia.service';

@Component({
  templateUrl: './docente-materia-delete-dialog.component.html',
})
export class DocenteMateriaDeleteDialogComponent {
  docenteMateria?: IDocenteMateria;

  constructor(protected docenteMateriaService: DocenteMateriaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.docenteMateriaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
