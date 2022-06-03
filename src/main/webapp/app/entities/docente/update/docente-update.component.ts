import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDocente, Docente } from '../docente.model';
import { DocenteService } from '../service/docente.service';
import { IUserData } from 'app/entities/user-data/user-data.model';
import { UserDataService } from 'app/entities/user-data/service/user-data.service';
import { IDocenteMateria } from 'app/entities/docente-materia/docente-materia.model';
import { DocenteMateriaService } from 'app/entities/docente-materia/service/docente-materia.service';

@Component({
  selector: 'ss-35-docente-update',
  templateUrl: './docente-update.component.html',
})
export class DocenteUpdateComponent implements OnInit {
  isSaving = false;

  userDataCollection: IUserData[] = [];
  docenteMateriasSharedCollection: IDocenteMateria[] = [];

  editForm = this.fb.group({
    id: [],
    colegio: [null, [Validators.required, Validators.maxLength(256)]],
    materia: [null, [Validators.required, Validators.maxLength(256)]],
    ciudad: [null, [Validators.required, Validators.maxLength(256)]],
    userData: [],
    docenteMateria: [],
  });

  constructor(
    protected docenteService: DocenteService,
    protected userDataService: UserDataService,
    protected docenteMateriaService: DocenteMateriaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ docente }) => {
      this.updateForm(docente);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const docente = this.createFromForm();
    if (docente.id !== undefined) {
      this.subscribeToSaveResponse(this.docenteService.update(docente));
    } else {
      this.subscribeToSaveResponse(this.docenteService.create(docente));
    }
  }

  trackUserDataById(_index: number, item: IUserData): number {
    return item.id!;
  }

  trackDocenteMateriaById(_index: number, item: IDocenteMateria): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocente>>): void {
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

  protected updateForm(docente: IDocente): void {
    this.editForm.patchValue({
      id: docente.id,
      colegio: docente.colegio,
      materia: docente.materia,
      ciudad: docente.ciudad,
      userData: docente.userData,
      docenteMateria: docente.docenteMateria,
    });

    this.userDataCollection = this.userDataService.addUserDataToCollectionIfMissing(this.userDataCollection, docente.userData);
    this.docenteMateriasSharedCollection = this.docenteMateriaService.addDocenteMateriaToCollectionIfMissing(
      this.docenteMateriasSharedCollection,
      docente.docenteMateria
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userDataService
      .query({ filter: 'docente-is-null' })
      .pipe(map((res: HttpResponse<IUserData[]>) => res.body ?? []))
      .pipe(
        map((userData: IUserData[]) =>
          this.userDataService.addUserDataToCollectionIfMissing(userData, this.editForm.get('userData')!.value)
        )
      )
      .subscribe((userData: IUserData[]) => (this.userDataCollection = userData));

    this.docenteMateriaService
      .query()
      .pipe(map((res: HttpResponse<IDocenteMateria[]>) => res.body ?? []))
      .pipe(
        map((docenteMaterias: IDocenteMateria[]) =>
          this.docenteMateriaService.addDocenteMateriaToCollectionIfMissing(docenteMaterias, this.editForm.get('docenteMateria')!.value)
        )
      )
      .subscribe((docenteMaterias: IDocenteMateria[]) => (this.docenteMateriasSharedCollection = docenteMaterias));
  }

  protected createFromForm(): IDocente {
    return {
      ...new Docente(),
      id: this.editForm.get(['id'])!.value,
      colegio: this.editForm.get(['colegio'])!.value,
      materia: this.editForm.get(['materia'])!.value,
      ciudad: this.editForm.get(['ciudad'])!.value,
      userData: this.editForm.get(['userData'])!.value,
      docenteMateria: this.editForm.get(['docenteMateria'])!.value,
    };
  }
}
