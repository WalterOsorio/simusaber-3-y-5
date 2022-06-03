import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAdministrador, Administrador } from '../administrador.model';
import { AdministradorService } from '../service/administrador.service';
import { IUserData } from 'app/entities/user-data/user-data.model';
import { UserDataService } from 'app/entities/user-data/service/user-data.service';
import { IAdmiBancoP } from 'app/entities/admi-banco-p/admi-banco-p.model';
import { AdmiBancoPService } from 'app/entities/admi-banco-p/service/admi-banco-p.service';

@Component({
  selector: 'ss-35-administrador-update',
  templateUrl: './administrador-update.component.html',
})
export class AdministradorUpdateComponent implements OnInit {
  isSaving = false;

  userDataCollection: IUserData[] = [];
  admiBancoPSSharedCollection: IAdmiBancoP[] = [];

  editForm = this.fb.group({
    id: [],
    nivelAcceso: [],
    userData: [],
    admiBancoP: [],
  });

  constructor(
    protected administradorService: AdministradorService,
    protected userDataService: UserDataService,
    protected admiBancoPService: AdmiBancoPService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ administrador }) => {
      this.updateForm(administrador);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const administrador = this.createFromForm();
    if (administrador.id !== undefined) {
      this.subscribeToSaveResponse(this.administradorService.update(administrador));
    } else {
      this.subscribeToSaveResponse(this.administradorService.create(administrador));
    }
  }

  trackUserDataById(_index: number, item: IUserData): number {
    return item.id!;
  }

  trackAdmiBancoPById(_index: number, item: IAdmiBancoP): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdministrador>>): void {
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

  protected updateForm(administrador: IAdministrador): void {
    this.editForm.patchValue({
      id: administrador.id,
      nivelAcceso: administrador.nivelAcceso,
      userData: administrador.userData,
      admiBancoP: administrador.admiBancoP,
    });

    this.userDataCollection = this.userDataService.addUserDataToCollectionIfMissing(this.userDataCollection, administrador.userData);
    this.admiBancoPSSharedCollection = this.admiBancoPService.addAdmiBancoPToCollectionIfMissing(
      this.admiBancoPSSharedCollection,
      administrador.admiBancoP
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userDataService
      .query({ filter: 'administrador-is-null' })
      .pipe(map((res: HttpResponse<IUserData[]>) => res.body ?? []))
      .pipe(
        map((userData: IUserData[]) =>
          this.userDataService.addUserDataToCollectionIfMissing(userData, this.editForm.get('userData')!.value)
        )
      )
      .subscribe((userData: IUserData[]) => (this.userDataCollection = userData));

    this.admiBancoPService
      .query()
      .pipe(map((res: HttpResponse<IAdmiBancoP[]>) => res.body ?? []))
      .pipe(
        map((admiBancoPS: IAdmiBancoP[]) =>
          this.admiBancoPService.addAdmiBancoPToCollectionIfMissing(admiBancoPS, this.editForm.get('admiBancoP')!.value)
        )
      )
      .subscribe((admiBancoPS: IAdmiBancoP[]) => (this.admiBancoPSSharedCollection = admiBancoPS));
  }

  protected createFromForm(): IAdministrador {
    return {
      ...new Administrador(),
      id: this.editForm.get(['id'])!.value,
      nivelAcceso: this.editForm.get(['nivelAcceso'])!.value,
      userData: this.editForm.get(['userData'])!.value,
      admiBancoP: this.editForm.get(['admiBancoP'])!.value,
    };
  }
}
