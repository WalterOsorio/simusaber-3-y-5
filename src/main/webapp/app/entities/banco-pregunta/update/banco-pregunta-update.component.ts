import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBancoPregunta, BancoPregunta } from '../banco-pregunta.model';
import { BancoPreguntaService } from '../service/banco-pregunta.service';
import { IAdmiBancoP } from 'app/entities/admi-banco-p/admi-banco-p.model';
import { AdmiBancoPService } from 'app/entities/admi-banco-p/service/admi-banco-p.service';

@Component({
  selector: 'ss-35-banco-pregunta-update',
  templateUrl: './banco-pregunta-update.component.html',
})
export class BancoPreguntaUpdateComponent implements OnInit {
  isSaving = false;

  admiBancoPSSharedCollection: IAdmiBancoP[] = [];

  editForm = this.fb.group({
    id: [],
    descripcion: [null, [Validators.required, Validators.maxLength(256)]],
    fechaActualizacion: [],
    materia: [null, [Validators.required, Validators.maxLength(256)]],
    numeroPreguntas: [],
    pregunta: [null, [Validators.required, Validators.maxLength(256)]],
    admiBancoP: [],
  });

  constructor(
    protected bancoPreguntaService: BancoPreguntaService,
    protected admiBancoPService: AdmiBancoPService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bancoPregunta }) => {
      this.updateForm(bancoPregunta);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bancoPregunta = this.createFromForm();
    if (bancoPregunta.id !== undefined) {
      this.subscribeToSaveResponse(this.bancoPreguntaService.update(bancoPregunta));
    } else {
      this.subscribeToSaveResponse(this.bancoPreguntaService.create(bancoPregunta));
    }
  }

  trackAdmiBancoPById(_index: number, item: IAdmiBancoP): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBancoPregunta>>): void {
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

  protected updateForm(bancoPregunta: IBancoPregunta): void {
    this.editForm.patchValue({
      id: bancoPregunta.id,
      descripcion: bancoPregunta.descripcion,
      fechaActualizacion: bancoPregunta.fechaActualizacion,
      materia: bancoPregunta.materia,
      numeroPreguntas: bancoPregunta.numeroPreguntas,
      pregunta: bancoPregunta.pregunta,
      admiBancoP: bancoPregunta.admiBancoP,
    });

    this.admiBancoPSSharedCollection = this.admiBancoPService.addAdmiBancoPToCollectionIfMissing(
      this.admiBancoPSSharedCollection,
      bancoPregunta.admiBancoP
    );
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): IBancoPregunta {
    return {
      ...new BancoPregunta(),
      id: this.editForm.get(['id'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      fechaActualizacion: this.editForm.get(['fechaActualizacion'])!.value,
      materia: this.editForm.get(['materia'])!.value,
      numeroPreguntas: this.editForm.get(['numeroPreguntas'])!.value,
      pregunta: this.editForm.get(['pregunta'])!.value,
      admiBancoP: this.editForm.get(['admiBancoP'])!.value,
    };
  }
}
