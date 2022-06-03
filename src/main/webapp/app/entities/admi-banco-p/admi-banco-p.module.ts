import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdmiBancoPComponent } from './list/admi-banco-p.component';
import { AdmiBancoPDetailComponent } from './detail/admi-banco-p-detail.component';
import { AdmiBancoPUpdateComponent } from './update/admi-banco-p-update.component';
import { AdmiBancoPDeleteDialogComponent } from './delete/admi-banco-p-delete-dialog.component';
import { AdmiBancoPRoutingModule } from './route/admi-banco-p-routing.module';

@NgModule({
  imports: [SharedModule, AdmiBancoPRoutingModule],
  declarations: [AdmiBancoPComponent, AdmiBancoPDetailComponent, AdmiBancoPUpdateComponent, AdmiBancoPDeleteDialogComponent],
  entryComponents: [AdmiBancoPDeleteDialogComponent],
})
export class AdmiBancoPModule {}
