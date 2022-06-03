import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EstudianteComponent } from './list/estudiante.component';
import { EstudianteDetailComponent } from './detail/estudiante-detail.component';
import { EstudianteUpdateComponent } from './update/estudiante-update.component';
import { EstudianteDeleteDialogComponent } from './delete/estudiante-delete-dialog.component';
import { EstudianteRoutingModule } from './route/estudiante-routing.module';

@NgModule({
  imports: [SharedModule, EstudianteRoutingModule],
  declarations: [EstudianteComponent, EstudianteDetailComponent, EstudianteUpdateComponent, EstudianteDeleteDialogComponent],
  entryComponents: [EstudianteDeleteDialogComponent],
})
export class EstudianteModule {}
