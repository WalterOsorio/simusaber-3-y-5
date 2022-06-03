import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DocenteComponent } from '../list/docente.component';
import { DocenteDetailComponent } from '../detail/docente-detail.component';
import { DocenteUpdateComponent } from '../update/docente-update.component';
import { DocenteRoutingResolveService } from './docente-routing-resolve.service';

const docenteRoute: Routes = [
  {
    path: '',
    component: DocenteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocenteDetailComponent,
    resolve: {
      docente: DocenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocenteUpdateComponent,
    resolve: {
      docente: DocenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocenteUpdateComponent,
    resolve: {
      docente: DocenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(docenteRoute)],
  exports: [RouterModule],
})
export class DocenteRoutingModule {}
