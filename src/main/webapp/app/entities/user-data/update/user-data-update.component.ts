import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserData, UserData } from '../user-data.model';
import { UserDataService } from '../service/user-data.service';
import { ITipoDocumento } from 'app/entities/tipo-documento/tipo-documento.model';
import { TipoDocumentoService } from 'app/entities/tipo-documento/service/tipo-documento.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'ss-35-user-data-update',
  templateUrl: './user-data-update.component.html',
})
export class UserDataUpdateComponent implements OnInit {
  isSaving = false;

  tipoDocumentosCollection: ITipoDocumento[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    numeroDocumento: [null, [Validators.required, Validators.maxLength(256)]],
    tipoDocumento: [],
    user: [],
  });

  constructor(
    protected userDataService: UserDataService,
    protected tipoDocumentoService: TipoDocumentoService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userData }) => {
      this.updateForm(userData);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userData = this.createFromForm();
    if (userData.id !== undefined) {
      this.subscribeToSaveResponse(this.userDataService.update(userData));
    } else {
      this.subscribeToSaveResponse(this.userDataService.create(userData));
    }
  }

  trackTipoDocumentoById(_index: number, item: ITipoDocumento): number {
    return item.id!;
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserData>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userData: IUserData): void {
    this.editForm.patchValue({
      id: userData.id,
      numeroDocumento: userData.numeroDocumento,
      tipoDocumento: userData.tipoDocumento,
      user: userData.user,
    });

    this.tipoDocumentosCollection = this.tipoDocumentoService.addTipoDocumentoToCollectionIfMissing(
      this.tipoDocumentosCollection,
      userData.tipoDocumento
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, userData.user);
  }

  protected loadRelationshipsOptions(): void {
    this.tipoDocumentoService
      .query({ filter: 'userdata-is-null' })
      .pipe(map((res: HttpResponse<ITipoDocumento[]>) => res.body ?? []))
      .pipe(
        map((tipoDocumentos: ITipoDocumento[]) =>
          this.tipoDocumentoService.addTipoDocumentoToCollectionIfMissing(tipoDocumentos, this.editForm.get('tipoDocumento')!.value)
        )
      )
      .subscribe((tipoDocumentos: ITipoDocumento[]) => (this.tipoDocumentosCollection = tipoDocumentos));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IUserData {
    return {
      ...new UserData(),
      id: this.editForm.get(['id'])!.value,
      numeroDocumento: this.editForm.get(['numeroDocumento'])!.value,
      tipoDocumento: this.editForm.get(['tipoDocumento'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
