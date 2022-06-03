import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MateriaComponent } from './list/materia.component';
import { MateriaDetailComponent } from './detail/materia-detail.component';
import { MateriaUpdateComponent } from './update/materia-update.component';
import { MateriaDeleteDialogComponent } from './delete/materia-delete-dialog.component';
import { MateriaRoutingModule } from './route/materia-routing.module';

@NgModule({
  imports: [SharedModule, MateriaRoutingModule],
  declarations: [MateriaComponent, MateriaDetailComponent, MateriaUpdateComponent, MateriaDeleteDialogComponent],
  entryComponents: [MateriaDeleteDialogComponent],
})
export class MateriaModule {}
