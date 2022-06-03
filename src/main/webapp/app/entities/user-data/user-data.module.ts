import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserDataComponent } from './list/user-data.component';
import { UserDataDetailComponent } from './detail/user-data-detail.component';
import { UserDataUpdateComponent } from './update/user-data-update.component';
import { UserDataDeleteDialogComponent } from './delete/user-data-delete-dialog.component';
import { UserDataRoutingModule } from './route/user-data-routing.module';

@NgModule({
  imports: [SharedModule, UserDataRoutingModule],
  declarations: [UserDataComponent, UserDataDetailComponent, UserDataUpdateComponent, UserDataDeleteDialogComponent],
  entryComponents: [UserDataDeleteDialogComponent],
})
export class UserDataModule {}
