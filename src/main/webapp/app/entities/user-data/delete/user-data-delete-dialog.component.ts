import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserData } from '../user-data.model';
import { UserDataService } from '../service/user-data.service';

@Component({
  templateUrl: './user-data-delete-dialog.component.html',
})
export class UserDataDeleteDialogComponent {
  userData?: IUserData;

  constructor(protected userDataService: UserDataService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userDataService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
