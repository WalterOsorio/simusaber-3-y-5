import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PruebaComponent } from '../list/prueba.component';
import { PruebaDetailComponent } from '../detail/prueba-detail.component';
import { PruebaUpdateComponent } from '../update/prueba-update.component';
import { PruebaRoutingResolveService } from './prueba-routing-resolve.service';

const pruebaRoute: Routes = [
  {
    path: '',
    component: PruebaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PruebaDetailComponent,
    resolve: {
      prueba: PruebaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PruebaUpdateComponent,
    resolve: {
      prueba: PruebaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PruebaUpdateComponent,
    resolve: {
      prueba: PruebaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pruebaRoute)],
  exports: [RouterModule],
})
export class PruebaRoutingModule {}
