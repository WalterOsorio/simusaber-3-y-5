import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISala, Sala } from '../sala.model';
import { SalaService } from '../service/sala.service';
import { ISalaMateria } from 'app/entities/sala-materia/sala-materia.model';
import { SalaMateriaService } from 'app/entities/sala-materia/service/sala-materia.service';
import { IDocente } from 'app/entities/docente/docente.model';
import { DocenteService } from 'app/entities/docente/service/docente.service';
import { IEstudianteSala } from 'app/entities/estudiante-sala/estudiante-sala.model';
import { EstudianteSalaService } from 'app/entities/estudiante-sala/service/estudiante-sala.service';
import { State } from 'app/entities/enumerations/state.model';

@Component({
  selector: 'ss-35-sala-update',
  templateUrl: './sala-update.component.html',
})
export class SalaUpdateComponent implements OnInit {
  isSaving = false;
  stateValues = Object.keys(State);

  salaMateriasSharedCollection: ISalaMateria[] = [];
  docentesSharedCollection: IDocente[] = [];
  estudianteSalasSharedCollection: IEstudianteSala[] = [];

  editForm = this.fb.group({
    id: [],
    estado: [],
    materia: [null, [Validators.required, Validators.maxLength(256)]],
    numeroEstudiantes: [],
    resultados: [],
    retroalimentacion: [null, [Validators.required, Validators.maxLength(256)]],
    salaMateria: [],
    docente: [],
    estudianteSala: [],
  });

  constructor(
    protected salaService: SalaService,
    protected salaMateriaService: SalaMateriaService,
    protected docenteService: DocenteService,
    protected estudianteSalaService: EstudianteSalaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sala }) => {
      this.updateForm(sala);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sala = this.createFromForm();
    if (sala.id !== undefined) {
      this.subscribeToSaveResponse(this.salaService.update(sala));
    } else {
      this.subscribeToSaveResponse(this.salaService.create(sala));
    }
  }

  trackSalaMateriaById(_index: number, item: ISalaMateria): number {
    return item.id!;
  }

  trackDocenteById(_index: number, item: IDocente): number {
    return item.id!;
  }

  trackEstudianteSalaById(_index: number, item: IEstudianteSala): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISala>>): void {
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

  protected updateForm(sala: ISala): void {
    this.editForm.patchValue({
      id: sala.id,
      estado: sala.estado,
      materia: sala.materia,
      numeroEstudiantes: sala.numeroEstudiantes,
      resultados: sala.resultados,
      retroalimentacion: sala.retroalimentacion,
      salaMateria: sala.salaMateria,
      docente: sala.docente,
      estudianteSala: sala.estudianteSala,
    });

    this.salaMateriasSharedCollection = this.salaMateriaService.addSalaMateriaToCollectionIfMissing(
      this.salaMateriasSharedCollection,
      sala.salaMateria
    );
    this.docentesSharedCollection = this.docenteService.addDocenteToCollectionIfMissing(this.docentesSharedCollection, sala.docente);
    this.estudianteSalasSharedCollection = this.estudianteSalaService.addEstudianteSalaToCollectionIfMissing(
      this.estudianteSalasSharedCollection,
      sala.estudianteSala
    );
  }

  protected loadRelationshipsOptions(): void {
    this.salaMateriaService
      .query()
      .pipe(map((res: HttpResponse<ISalaMateria[]>) => res.body ?? []))
      .pipe(
        map((salaMaterias: ISalaMateria[]) =>
          this.salaMateriaService.addSalaMateriaToCollectionIfMissing(salaMaterias, this.editForm.get('salaMateria')!.value)
        )
      )
      .subscribe((salaMaterias: ISalaMateria[]) => (this.salaMateriasSharedCollection = salaMaterias));

    this.docenteService
      .query()
      .pipe(map((res: HttpResponse<IDocente[]>) => res.body ?? []))
      .pipe(
        map((docentes: IDocente[]) => this.docenteService.addDocenteToCollectionIfMissing(docentes, this.editForm.get('docente')!.value))
      )
      .subscribe((docentes: IDocente[]) => (this.docentesSharedCollection = docentes));

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

  protected createFromForm(): ISala {
    return {
      ...new Sala(),
      id: this.editForm.get(['id'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      materia: this.editForm.get(['materia'])!.value,
      numeroEstudiantes: this.editForm.get(['numeroEstudiantes'])!.value,
      resultados: this.editForm.get(['resultados'])!.value,
      retroalimentacion: this.editForm.get(['retroalimentacion'])!.value,
      salaMateria: this.editForm.get(['salaMateria'])!.value,
      docente: this.editForm.get(['docente'])!.value,
      estudianteSala: this.editForm.get(['estudianteSala'])!.value,
    };
  }
}
