import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TipoDocumentoComponent } from './list/tipo-documento.component';
import { TipoDocumentoDetailComponent } from './detail/tipo-documento-detail.component';
import { TipoDocumentoUpdateComponent } from './update/tipo-documento-update.component';
import { TipoDocumentoDeleteDialogComponent } from './delete/tipo-documento-delete-dialog.component';
import { TipoDocumentoRoutingModule } from './route/tipo-documento-routing.module';

@NgModule({
  imports: [SharedModule, TipoDocumentoRoutingModule],
  declarations: [TipoDocumentoComponent, TipoDocumentoDetailComponent, TipoDocumentoUpdateComponent, TipoDocumentoDeleteDialogComponent],
  entryComponents: [TipoDocumentoDeleteDialogComponent],
})
export class TipoDocumentoModule {}
