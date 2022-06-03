import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdministradorComponent } from './list/administrador.component';
import { AdministradorDetailComponent } from './detail/administrador-detail.component';
import { AdministradorUpdateComponent } from './update/administrador-update.component';
import { AdministradorDeleteDialogComponent } from './delete/administrador-delete-dialog.component';
import { AdministradorRoutingModule } from './route/administrador-routing.module';

@NgModule({
  imports: [SharedModule, AdministradorRoutingModule],
  declarations: [AdministradorComponent, AdministradorDetailComponent, AdministradorUpdateComponent, AdministradorDeleteDialogComponent],
  entryComponents: [AdministradorDeleteDialogComponent],
})
export class AdministradorModule {}
