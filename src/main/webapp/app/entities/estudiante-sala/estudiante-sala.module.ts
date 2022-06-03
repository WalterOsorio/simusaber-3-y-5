import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EstudianteSalaComponent } from './list/estudiante-sala.component';
import { EstudianteSalaDetailComponent } from './detail/estudiante-sala-detail.component';
import { EstudianteSalaUpdateComponent } from './update/estudiante-sala-update.component';
import { EstudianteSalaDeleteDialogComponent } from './delete/estudiante-sala-delete-dialog.component';
import { EstudianteSalaRoutingModule } from './route/estudiante-sala-routing.module';

@NgModule({
  imports: [SharedModule, EstudianteSalaRoutingModule],
  declarations: [
    EstudianteSalaComponent,
    EstudianteSalaDetailComponent,
    EstudianteSalaUpdateComponent,
    EstudianteSalaDeleteDialogComponent,
  ],
  entryComponents: [EstudianteSalaDeleteDialogComponent],
})
export class EstudianteSalaModule {}
