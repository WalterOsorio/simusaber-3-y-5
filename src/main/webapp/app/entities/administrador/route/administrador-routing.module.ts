import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdministradorComponent } from '../list/administrador.component';
import { AdministradorDetailComponent } from '../detail/administrador-detail.component';
import { AdministradorUpdateComponent } from '../update/administrador-update.component';
import { AdministradorRoutingResolveService } from './administrador-routing-resolve.service';

const administradorRoute: Routes = [
  {
    path: '',
    component: AdministradorComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdministradorDetailComponent,
    resolve: {
      administrador: AdministradorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdministradorUpdateComponent,
    resolve: {
      administrador: AdministradorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdministradorUpdateComponent,
    resolve: {
      administrador: AdministradorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(administradorRoute)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
