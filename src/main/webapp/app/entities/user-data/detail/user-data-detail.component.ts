import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserData } from '../user-data.model';

@Component({
  selector: 'ss-35-user-data-detail',
  templateUrl: './user-data-detail.component.html',
})
export class UserDataDetailComponent implements OnInit {
  userData: IUserData | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userData }) => {
      this.userData = userData;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
