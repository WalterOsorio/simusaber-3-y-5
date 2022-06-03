import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MateriaComponent } from '../list/materia.component';
import { MateriaDetailComponent } from '../detail/materia-detail.component';
import { MateriaUpdateComponent } from '../update/materia-update.component';
import { MateriaRoutingResolveService } from './materia-routing-resolve.service';

const materiaRoute: Routes = [
  {
    path: '',
    component: MateriaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MateriaDetailComponent,
    resolve: {
      materia: MateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MateriaUpdateComponent,
    resolve: {
      materia: MateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MateriaUpdateComponent,
    resolve: {
      materia: MateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(materiaRoute)],
  exports: [RouterModule],
})
export class MateriaRoutingModule {}
