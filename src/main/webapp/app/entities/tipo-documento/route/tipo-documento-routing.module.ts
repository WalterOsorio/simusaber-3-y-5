import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TipoDocumentoComponent } from '../list/tipo-documento.component';
import { TipoDocumentoDetailComponent } from '../detail/tipo-documento-detail.component';
import { TipoDocumentoUpdateComponent } from '../update/tipo-documento-update.component';
import { TipoDocumentoRoutingResolveService } from './tipo-documento-routing-resolve.service';

const tipoDocumentoRoute: Routes = [
  {
    path: '',
    component: TipoDocumentoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TipoDocumentoDetailComponent,
    resolve: {
      tipoDocumento: TipoDocumentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TipoDocumentoUpdateComponent,
    resolve: {
      tipoDocumento: TipoDocumentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TipoDocumentoUpdateComponent,
    resolve: {
      tipoDocumento: TipoDocumentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tipoDocumentoRoute)],
  exports: [RouterModule],
})
export class TipoDocumentoRoutingModule {}
