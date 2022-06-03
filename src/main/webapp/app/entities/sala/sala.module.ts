import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SalaComponent } from './list/sala.component';
import { SalaDetailComponent } from './detail/sala-detail.component';
import { SalaUpdateComponent } from './update/sala-update.component';
import { SalaDeleteDialogComponent } from './delete/sala-delete-dialog.component';
import { SalaRoutingModule } from './route/sala-routing.module';

@NgModule({
  imports: [SharedModule, SalaRoutingModule],
  declarations: [SalaComponent, SalaDetailComponent, SalaUpdateComponent, SalaDeleteDialogComponent],
  entryComponents: [SalaDeleteDialogComponent],
})
export class SalaModule {}
