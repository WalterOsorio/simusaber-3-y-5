import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdministrador } from '../administrador.model';
import { AdministradorService } from '../service/administrador.service';

@Component({
  templateUrl: './administrador-delete-dialog.component.html',
})
export class AdministradorDeleteDialogComponent {
  administrador?: IAdministrador;

  constructor(protected administradorService: AdministradorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.administradorService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
