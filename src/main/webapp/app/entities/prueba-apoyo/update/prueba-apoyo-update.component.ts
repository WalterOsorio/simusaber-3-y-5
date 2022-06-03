import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPruebaApoyo, PruebaApoyo } from '../prueba-apoyo.model';
import { PruebaApoyoService } from '../service/prueba-apoyo.service';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/estudiante/service/estudiante.service';
import { IBancoPregunta } from 'app/entities/banco-pregunta/banco-pregunta.model';
import { BancoPreguntaService } from 'app/entities/banco-pregunta/service/banco-pregunta.service';

@Component({
  selector: 'ss-35-prueba-apoyo-update',
  templateUrl: './prueba-apoyo-update.component.html',
})
export class PruebaApoyoUpdateComponent implements OnInit {
  isSaving = false;

  estudiantesSharedCollection: IEstudiante[] = [];
  bancoPreguntasSharedCollection: IBancoPregunta[] = [];

  editForm = this.fb.group({
    id: [],
    materia: [null, [Validators.required, Validators.maxLength(256)]],
    pregunta: [null, [Validators.required, Validators.maxLength(256)]],
    resultado: [],
    retroalimentacion: [null, [Validators.required, Validators.maxLength(256)]],
    estudiante: [],
    bancoPregunta: [],
  });

  constructor(
    protected pruebaApoyoService: PruebaApoyoService,
    protected estudianteService: EstudianteService,
    protected bancoPreguntaService: BancoPreguntaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pruebaApoyo }) => {
      this.updateForm(pruebaApoyo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pruebaApoyo = this.createFromForm();
    if (pruebaApoyo.id !== undefined) {
      this.subscribeToSaveResponse(this.pruebaApoyoService.update(pruebaApoyo));
    } else {
      this.subscribeToSaveResponse(this.pruebaApoyoService.create(pruebaApoyo));
    }
  }

  trackEstudianteById(_index: number, item: IEstudiante): number {
    return item.id!;
  }

  trackBancoPreguntaById(_index: number, item: IBancoPregunta): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPruebaApoyo>>): void {
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

  protected updateForm(pruebaApoyo: IPruebaApoyo): void {
    this.editForm.patchValue({
      id: pruebaApoyo.id,
      materia: pruebaApoyo.materia,
      pregunta: pruebaApoyo.pregunta,
      resultado: pruebaApoyo.resultado,
      retroalimentacion: pruebaApoyo.retroalimentacion,
      estudiante: pruebaApoyo.estudiante,
      bancoPregunta: pruebaApoyo.bancoPregunta,
    });

    this.estudiantesSharedCollection = this.estudianteService.addEstudianteToCollectionIfMissing(
      this.estudiantesSharedCollection,
      pruebaApoyo.estudiante
    );
    this.bancoPreguntasSharedCollection = this.bancoPreguntaService.addBancoPreguntaToCollectionIfMissing(
      this.bancoPreguntasSharedCollection,
      pruebaApoyo.bancoPregunta
    );
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
  }

  protected createFromForm(): IPruebaApoyo {
    return {
      ...new PruebaApoyo(),
      id: this.editForm.get(['id'])!.value,
      materia: this.editForm.get(['materia'])!.value,
      pregunta: this.editForm.get(['pregunta'])!.value,
      resultado: this.editForm.get(['resultado'])!.value,
      retroalimentacion: this.editForm.get(['retroalimentacion'])!.value,
      estudiante: this.editForm.get(['estudiante'])!.value,
      bancoPregunta: this.editForm.get(['bancoPregunta'])!.value,
    };
  }
}
