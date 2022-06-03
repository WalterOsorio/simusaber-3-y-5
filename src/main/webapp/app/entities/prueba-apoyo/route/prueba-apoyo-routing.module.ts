import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PruebaApoyoComponent } from '../list/prueba-apoyo.component';
import { PruebaApoyoDetailComponent } from '../detail/prueba-apoyo-detail.component';
import { PruebaApoyoUpdateComponent } from '../update/prueba-apoyo-update.component';
import { PruebaApoyoRoutingResolveService } from './prueba-apoyo-routing-resolve.service';

const pruebaApoyoRoute: Routes = [
  {
    path: '',
    component: PruebaApoyoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PruebaApoyoDetailComponent,
    resolve: {
      pruebaApoyo: PruebaApoyoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PruebaApoyoUpdateComponent,
    resolve: {
      pruebaApoyo: PruebaApoyoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PruebaApoyoUpdateComponent,
    resolve: {
      pruebaApoyo: PruebaApoyoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pruebaApoyoRoute)],
  exports: [RouterModule],
})
export class PruebaApoyoRoutingModule {}
