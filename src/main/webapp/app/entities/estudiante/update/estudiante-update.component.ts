import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEstudiante, Estudiante } from '../estudiante.model';
import { EstudianteService } from '../service/estudiante.service';
import { IUserData } from 'app/entities/user-data/user-data.model';
import { UserDataService } from 'app/entities/user-data/service/user-data.service';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';
import { IEstudianteSala } from 'app/entities/estudiante-sala/estudiante-sala.model';
import { EstudianteSalaService } from 'app/entities/estudiante-sala/service/estudiante-sala.service';

@Component({
  selector: 'ss-35-estudiante-update',
  templateUrl: './estudiante-update.component.html',
})
export class EstudianteUpdateComponent implements OnInit {
  isSaving = false;

  userDataCollection: IUserData[] = [];
  salasSharedCollection: ISala[] = [];
  estudianteSalasSharedCollection: IEstudianteSala[] = [];

  editForm = this.fb.group({
    id: [],
    grado: [null, [Validators.required, Validators.maxLength(256)]],
    colegio: [null, [Validators.required, Validators.maxLength(256)]],
    fechaNacimiento: [],
    ciudad: [null, [Validators.required, Validators.maxLength(256)]],
    userData: [],
    salas: [],
    estudianteSala: [],
  });

  constructor(
    protected estudianteService: EstudianteService,
    protected userDataService: UserDataService,
    protected salaService: SalaService,
    protected estudianteSalaService: EstudianteSalaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudiante }) => {
      this.updateForm(estudiante);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estudiante = this.createFromForm();
    if (estudiante.id !== undefined) {
      this.subscribeToSaveResponse(this.estudianteService.update(estudiante));
    } else {
      this.subscribeToSaveResponse(this.estudianteService.create(estudiante));
    }
  }

  trackUserDataById(_index: number, item: IUserData): number {
    return item.id!;
  }

  trackSalaById(_index: number, item: ISala): number {
    return item.id!;
  }

  trackEstudianteSalaById(_index: number, item: IEstudianteSala): number {
    return item.id!;
  }

  getSelectedSala(option: ISala, selectedVals?: ISala[]): ISala {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstudiante>>): void {
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

  protected updateForm(estudiante: IEstudiante): void {
    this.editForm.patchValue({
      id: estudiante.id,
      grado: estudiante.grado,
      colegio: estudiante.colegio,
      fechaNacimiento: estudiante.fechaNacimiento,
      ciudad: estudiante.ciudad,
      userData: estudiante.userData,
      salas: estudiante.salas,
      estudianteSala: estudiante.estudianteSala,
    });

    this.userDataCollection = this.userDataService.addUserDataToCollectionIfMissing(this.userDataCollection, estudiante.userData);
    this.salasSharedCollection = this.salaService.addSalaToCollectionIfMissing(this.salasSharedCollection, ...(estudiante.salas ?? []));
    this.estudianteSalasSharedCollection = this.estudianteSalaService.addEstudianteSalaToCollectionIfMissing(
      this.estudianteSalasSharedCollection,
      estudiante.estudianteSala
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userDataService
      .query({ filter: 'estudiante-is-null' })
      .pipe(map((res: HttpResponse<IUserData[]>) => res.body ?? []))
      .pipe(
        map((userData: IUserData[]) =>
          this.userDataService.addUserDataToCollectionIfMissing(userData, this.editForm.get('userData')!.value)
        )
      )
      .subscribe((userData: IUserData[]) => (this.userDataCollection = userData));

    this.salaService
      .query()
      .pipe(map((res: HttpResponse<ISala[]>) => res.body ?? []))
      .pipe(map((salas: ISala[]) => this.salaService.addSalaToCollectionIfMissing(salas, ...(this.editForm.get('salas')!.value ?? []))))
      .subscribe((salas: ISala[]) => (this.salasSharedCollection = salas));

    this.estudianteSalaService
      .query()
      .pipe(map((res: HttpResponse<IEstudianteSala[]>) => res.body ?? []))
      .pipe(
        map((estudianteSalas: IEstudianteSala[]) =>
          this.estudianteSalaService.addEstudianteSalaToCollectionIfMissing(estudianteSalas, this.editForm.get('estudianteSala')!.value)
        )
      )
      .subscribe((estudianteSalas: IEstudianteSala[]) => (this.estudianteSalasSharedCollection = estudianteSalas));
  }

  protected createFromForm(): IEstudiante {
    return {
      ...new Estudiante(),
      id: this.editForm.get(['id'])!.value,
      grado: this.editForm.get(['grado'])!.value,
      colegio: this.editForm.get(['colegio'])!.value,
      fechaNacimiento: this.editForm.get(['fechaNacimiento'])!.value,
      ciudad: this.editForm.get(['ciudad'])!.value,
      userData: this.editForm.get(['userData'])!.value,
      salas: this.editForm.get(['salas'])!.value,
      estudianteSala: this.editForm.get(['estudianteSala'])!.value,
    };
  }
}
