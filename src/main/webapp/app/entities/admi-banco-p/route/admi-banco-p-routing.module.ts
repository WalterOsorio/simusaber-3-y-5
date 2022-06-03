import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdmiBancoPComponent } from '../list/admi-banco-p.component';
import { AdmiBancoPDetailComponent } from '../detail/admi-banco-p-detail.component';
import { AdmiBancoPUpdateComponent } from '../update/admi-banco-p-update.component';
import { AdmiBancoPRoutingResolveService } from './admi-banco-p-routing-resolve.service';

const admiBancoPRoute: Routes = [
  {
    path: '',
    component: AdmiBancoPComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdmiBancoPDetailComponent,
    resolve: {
      admiBancoP: AdmiBancoPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdmiBancoPUpdateComponent,
    resolve: {
      admiBancoP: AdmiBancoPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdmiBancoPUpdateComponent,
    resolve: {
      admiBancoP: AdmiBancoPRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(admiBancoPRoute)],
  exports: [RouterModule],
})
export class AdmiBancoPRoutingModule {}
