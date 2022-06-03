import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EstudianteSalaComponent } from '../list/estudiante-sala.component';
import { EstudianteSalaDetailComponent } from '../detail/estudiante-sala-detail.component';
import { EstudianteSalaUpdateComponent } from '../update/estudiante-sala-update.component';
import { EstudianteSalaRoutingResolveService } from './estudiante-sala-routing-resolve.service';

const estudianteSalaRoute: Routes = [
  {
    path: '',
    component: EstudianteSalaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstudianteSalaDetailComponent,
    resolve: {
      estudianteSala: EstudianteSalaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstudianteSalaUpdateComponent,
    resolve: {
      estudianteSala: EstudianteSalaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstudianteSalaUpdateComponent,
    resolve: {
      estudianteSala: EstudianteSalaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estudianteSalaRoute)],
  exports: [RouterModule],
})
export class EstudianteSalaRoutingModule {}
