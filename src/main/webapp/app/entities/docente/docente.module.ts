import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DocenteComponent } from './list/docente.component';
import { DocenteDetailComponent } from './detail/docente-detail.component';
import { DocenteUpdateComponent } from './update/docente-update.component';
import { DocenteDeleteDialogComponent } from './delete/docente-delete-dialog.component';
import { DocenteRoutingModule } from './route/docente-routing.module';

@NgModule({
  imports: [SharedModule, DocenteRoutingModule],
  declarations: [DocenteComponent, DocenteDetailComponent, DocenteUpdateComponent, DocenteDeleteDialogComponent],
  entryComponents: [DocenteDeleteDialogComponent],
})
export class DocenteModule {}
