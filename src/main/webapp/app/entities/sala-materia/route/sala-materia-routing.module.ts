import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SalaMateriaComponent } from '../list/sala-materia.component';
import { SalaMateriaDetailComponent } from '../detail/sala-materia-detail.component';
import { SalaMateriaUpdateComponent } from '../update/sala-materia-update.component';
import { SalaMateriaRoutingResolveService } from './sala-materia-routing-resolve.service';

const salaMateriaRoute: Routes = [
  {
    path: '',
    component: SalaMateriaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SalaMateriaDetailComponent,
    resolve: {
      salaMateria: SalaMateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SalaMateriaUpdateComponent,
    resolve: {
      salaMateria: SalaMateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SalaMateriaUpdateComponent,
    resolve: {
      salaMateria: SalaMateriaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(salaMateriaRoute)],
  exports: [RouterModule],
})
export class SalaMateriaRoutingModule {}
