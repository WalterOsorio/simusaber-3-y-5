import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PruebaApoyoComponent } from './list/prueba-apoyo.component';
import { PruebaApoyoDetailComponent } from './detail/prueba-apoyo-detail.component';
import { PruebaApoyoUpdateComponent } from './update/prueba-apoyo-update.component';
import { PruebaApoyoDeleteDialogComponent } from './delete/prueba-apoyo-delete-dialog.component';
import { PruebaApoyoRoutingModule } from './route/prueba-apoyo-routing.module';

@NgModule({
  imports: [SharedModule, PruebaApoyoRoutingModule],
  declarations: [PruebaApoyoComponent, PruebaApoyoDetailComponent, PruebaApoyoUpdateComponent, PruebaApoyoDeleteDialogComponent],
  entryComponents: [PruebaApoyoDeleteDialogComponent],
})
export class PruebaApoyoModule {}
