import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserData } from '../user-data.model';
import { UserDataService } from '../service/user-data.service';
import { UserDataDeleteDialogComponent } from '../delete/user-data-delete-dialog.component';

@Component({
  selector: 'ss-35-user-data',
  templateUrl: './user-data.component.html',
})
export class UserDataComponent implements OnInit {
  userData?: IUserData[];
  isLoading = false;

  constructor(protected userDataService: UserDataService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.userDataService.query().subscribe({
      next: (res: HttpResponse<IUserData[]>) => {
        this.isLoading = false;
        this.userData = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IUserData): number {
    return item.id!;
  }

  delete(userData: IUserData): void {
    const modalRef = this.modalService.open(UserDataDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userData = userData;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
