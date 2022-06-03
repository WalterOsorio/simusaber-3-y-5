import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SalaComponent } from '../list/sala.component';
import { SalaDetailComponent } from '../detail/sala-detail.component';
import { SalaUpdateComponent } from '../update/sala-update.component';
import { SalaRoutingResolveService } from './sala-routing-resolve.service';

const salaRoute: Routes = [
  {
    path: '',
    component: SalaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SalaDetailComponent,
    resolve: {
      sala: SalaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SalaUpdateComponent,
    resolve: {
      sala: SalaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SalaUpdateComponent,
    resolve: {
      sala: SalaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(salaRoute)],
  exports: [RouterModule],
})
export class SalaRoutingModule {}
