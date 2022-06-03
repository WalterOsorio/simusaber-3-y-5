import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserDataComponent } from '../list/user-data.component';
import { UserDataDetailComponent } from '../detail/user-data-detail.component';
import { UserDataUpdateComponent } from '../update/user-data-update.component';
import { UserDataRoutingResolveService } from './user-data-routing-resolve.service';

const userDataRoute: Routes = [
  {
    path: '',
    component: UserDataComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserDataDetailComponent,
    resolve: {
      userData: UserDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserDataUpdateComponent,
    resolve: {
      userData: UserDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserDataUpdateComponent,
    resolve: {
      userData: UserDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userDataRoute)],
  exports: [RouterModule],
})
export class UserDataRoutingModule {}
