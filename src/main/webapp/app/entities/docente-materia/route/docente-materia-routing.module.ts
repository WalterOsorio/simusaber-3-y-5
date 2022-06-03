import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DocenteMateriaComponent } from '../list/docente-materia.component';
import { DocenteMateriaDetailComponent } from '../detail/docente-materia-detail.component';
import { DocenteMateriaUpdateComponent } from '../update/docente-materia-update.component';
import { DocenteMateriaRoutingResolveService } from './docente-materia-routing-resolve.service';

const docenteMateriaRoute: Routes = [
  {
    path: '',
    component: DocenteMateriaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocenteMateriaDetailComponent,
    resolve: {
      docenteMateria: DocenteMateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DocenteMateriaUpdateComponent,
    resolve: {
      docenteMateria: DocenteMateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocenteMateriaUpdateComponent,
    resolve: {
      docenteMateria: DocenteMateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(docenteMateriaRoute)],
  exports: [RouterModule],
})
export class DocenteMateriaRoutingModule {}
