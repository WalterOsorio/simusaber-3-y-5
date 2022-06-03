import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BancoPreguntaComponent } from '../list/banco-pregunta.component';
import { BancoPreguntaDetailComponent } from '../detail/banco-pregunta-detail.component';
import { BancoPreguntaUpdateComponent } from '../update/banco-pregunta-update.component';
import { BancoPreguntaRoutingResolveService } from './banco-pregunta-routing-resolve.service';

const bancoPreguntaRoute: Routes = [
  {
    path: '',
    component: BancoPreguntaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BancoPreguntaDetailComponent,
    resolve: {
      bancoPregunta: BancoPreguntaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BancoPreguntaUpdateComponent,
    resolve: {
      bancoPregunta: BancoPreguntaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BancoPreguntaUpdateComponent,
    resolve: {
      bancoPregunta: BancoPreguntaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bancoPreguntaRoute)],
  exports: [RouterModule],
})
export class BancoPreguntaRoutingModule {}
