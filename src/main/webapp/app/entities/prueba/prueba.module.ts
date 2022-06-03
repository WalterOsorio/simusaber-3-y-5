import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PruebaComponent } from './list/prueba.component';
import { PruebaDetailComponent } from './detail/prueba-detail.component';
import { PruebaUpdateComponent } from './update/prueba-update.component';
import { PruebaDeleteDialogComponent } from './delete/prueba-delete-dialog.component';
import { PruebaRoutingModule } from './route/prueba-routing.module';

@NgModule({
  imports: [SharedModule, PruebaRoutingModule],
  declarations: [PruebaComponent, PruebaDetailComponent, PruebaUpdateComponent, PruebaDeleteDialogComponent],
  entryComponents: [PruebaDeleteDialogComponent],
})
export class PruebaModule {}
