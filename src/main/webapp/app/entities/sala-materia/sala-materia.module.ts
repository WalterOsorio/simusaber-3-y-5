import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SalaMateriaComponent } from './list/sala-materia.component';
import { SalaMateriaDetailComponent } from './detail/sala-materia-detail.component';
import { SalaMateriaUpdateComponent } from './update/sala-materia-update.component';
import { SalaMateriaDeleteDialogComponent } from './delete/sala-materia-delete-dialog.component';
import { SalaMateriaRoutingModule } from './route/sala-materia-routing.module';

@NgModule({
  imports: [SharedModule, SalaMateriaRoutingModule],
  declarations: [SalaMateriaComponent, SalaMateriaDetailComponent, SalaMateriaUpdateComponent, SalaMateriaDeleteDialogComponent],
  entryComponents: [SalaMateriaDeleteDialogComponent],
})
export class SalaMateriaModule {}
