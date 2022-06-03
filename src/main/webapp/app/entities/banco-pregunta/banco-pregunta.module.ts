import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BancoPreguntaComponent } from './list/banco-pregunta.component';
import { BancoPreguntaDetailComponent } from './detail/banco-pregunta-detail.component';
import { BancoPreguntaUpdateComponent } from './update/banco-pregunta-update.component';
import { BancoPreguntaDeleteDialogComponent } from './delete/banco-pregunta-delete-dialog.component';
import { BancoPreguntaRoutingModule } from './route/banco-pregunta-routing.module';

@NgModule({
  imports: [SharedModule, BancoPreguntaRoutingModule],
  declarations: [BancoPreguntaComponent, BancoPreguntaDetailComponent, BancoPreguntaUpdateComponent, BancoPreguntaDeleteDialogComponent],
  entryComponents: [BancoPreguntaDeleteDialogComponent],
})
export class BancoPreguntaModule {}
