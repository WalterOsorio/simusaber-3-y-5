import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DocenteMateriaComponent } from './list/docente-materia.component';
import { DocenteMateriaDetailComponent } from './detail/docente-materia-detail.component';
import { DocenteMateriaUpdateComponent } from './update/docente-materia-update.component';
import { DocenteMateriaDeleteDialogComponent } from './delete/docente-materia-delete-dialog.component';
import { DocenteMateriaRoutingModule } from './route/docente-materia-routing.module';

@NgModule({
  imports: [SharedModule, DocenteMateriaRoutingModule],
  declarations: [
    DocenteMateriaComponent,
    DocenteMateriaDetailComponent,
    DocenteMateriaUpdateComponent,
    DocenteMateriaDeleteDialogComponent,
  ],
  entryComponents: [DocenteMateriaDeleteDialogComponent],
})
export class DocenteMateriaModule {}
