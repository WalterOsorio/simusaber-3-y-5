import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPrueba, Prueba } from '../prueba.model';
import { PruebaService } from '../service/prueba.service';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/estudiante/service/estudiante.service';
import { IBancoPregunta } from 'app/entities/banco-pregunta/banco-pregunta.model';
import { BancoPreguntaService } from 'app/entities/banco-pregunta/service/banco-pregunta.service';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';

@Component({
  selector: 'ss-35-prueba-update',
  templateUrl: './prueba-update.component.html',
})
export class PruebaUpdateComponent implements OnInit {
  isSaving = false;

  estudiantesSharedCollection: IEstudiante[] = [];
  bancoPreguntasSharedCollection: IBancoPregunta[] = [];
  salasSharedCollection: ISala[] = [];

  editForm = this.fb.group({
    id: [],
    fechaAplicacion: [],
    resultado: [],
    retroalimentacion: [null, [Validators.required, Validators.maxLength(256)]],
    estudiante: [],
    bancoPregunta: [],
    sala: [],
  });

  constructor(
    protected pruebaService: PruebaService,
    protected estudianteService: EstudianteService,
    protected bancoPreguntaService: BancoPreguntaService,
    protected salaService: SalaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prueba }) => {
      this.updateForm(prueba);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const prueba = this.createFromForm();
    if (prueba.id !== undefined) {
      this.subscribeToSaveResponse(this.pruebaService.update(prueba));
    } else {
      this.subscribeToSaveResponse(this.pruebaService.create(prueba));
    }
  }

  trackEstudianteById(_index: number, item: IEstudiante): number {
    return item.id!;
  }

  trackBancoPreguntaById(_index: number, item: IBancoPregunta): number {
    return item.id!;
  }

  trackSalaById(_index: number, item: ISala): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrueba>>): void {
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

  protected updateForm(prueba: IPrueba): void {
    this.editForm.patchValue({
      id: prueba.id,
      fechaAplicacion: prueba.fechaAplicacion,
      resultado: prueba.resultado,
      retroalimentacion: prueba.retroalimentacion,
      estudiante: prueba.estudiante,
      bancoPregunta: prueba.bancoPregunta,
      sala: prueba.sala,
    });

    this.estudiantesSharedCollection = this.estudianteService.addEstudianteToCollectionIfMissing(
      this.estudiantesSharedCollection,
      prueba.estudiante
    );
    this.bancoPreguntasSharedCollection = this.bancoPreguntaService.addBancoPreguntaToCollectionIfMissing(
      this.bancoPreguntasSharedCollection,
      prueba.bancoPregunta
    );
    this.salasSharedCollection = this.salaService.addSalaToCollectionIfMissing(this.salasSharedCollection, prueba.sala);
  }

  protected loadRelationshipsOptions(): void {
    this.estudianteService
      .query()
      .pipe(map((res: HttpResponse<IEstudiante[]>) => res.body ?? []))
      .pipe(
        map((estudiantes: IEstudiante[]) =>
          this.estudianteService.addEstudianteToCollectionIfMissing(estudiantes, this.editForm.get('estudiante')!.value)
        )
      )
      .subscribe((estudiantes: IEstudiante[]) => (this.estudiantesSharedCollection = estudiantes));

    this.bancoPreguntaService
      .query()
      .pipe(map((res: HttpResponse<IBancoPregunta[]>) => res.body ?? []))
      .pipe(
        map((bancoPreguntas: IBancoPregunta[]) =>
          this.bancoPreguntaService.addBancoPreguntaToCollectionIfMissing(bancoPreguntas, this.editForm.get('bancoPregunta')!.value)
        )
      )
      .subscribe((bancoPreguntas: IBancoPregunta[]) => (this.bancoPreguntasSharedCollection = bancoPreguntas));

    this.salaService
      .query()
      .pipe(map((res: HttpResponse<ISala[]>) => res.body ?? []))
      .pipe(map((salas: ISala[]) => this.salaService.addSalaToCollectionIfMissing(salas, this.editForm.get('sala')!.value)))
      .subscribe((salas: ISala[]) => (this.salasSharedCollection = salas));
  }

  protected createFromForm(): IPrueba {
    return {
      ...new Prueba(),
      id: this.editForm.get(['id'])!.value,
      fechaAplicacion: this.editForm.get(['fechaAplicacion'])!.value,
      resultado: this.editForm.get(['resultado'])!.value,
      retroalimentacion: this.editForm.get(['retroalimentacion'])!.value,
      estudiante: this.editForm.get(['estudiante'])!.value,
      bancoPregunta: this.editForm.get(['bancoPregunta'])!.value,
      sala: this.editForm.get(['sala'])!.value,
    };
  }
}
