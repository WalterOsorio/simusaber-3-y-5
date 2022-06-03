import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMateria, Materia } from '../materia.model';
import { MateriaService } from '../service/materia.service';
import { IDocenteMateria } from 'app/entities/docente-materia/docente-materia.model';
import { DocenteMateriaService } from 'app/entities/docente-materia/service/docente-materia.service';
import { ISalaMateria } from 'app/entities/sala-materia/sala-materia.model';
import { SalaMateriaService } from 'app/entities/sala-materia/service/sala-materia.service';

@Component({
  selector: 'ss-35-materia-update',
  templateUrl: './materia-update.component.html',
})
export class MateriaUpdateComponent implements OnInit {
  isSaving = false;

  docenteMateriasSharedCollection: IDocenteMateria[] = [];
  salaMateriasSharedCollection: ISalaMateria[] = [];

  editForm = this.fb.group({
    id: [],
    nombreMateria: [null, [Validators.required, Validators.maxLength(256)]],
    numeroPreguntas: [],
    pregunta: [null, [Validators.required, Validators.maxLength(256)]],
    docenteMateria: [],
    salaMateria: [],
  });

  constructor(
    protected materiaService: MateriaService,
    protected docenteMateriaService: DocenteMateriaService,
    protected salaMateriaService: SalaMateriaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ materia }) => {
      this.updateForm(materia);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const materia = this.createFromForm();
    if (materia.id !== undefined) {
      this.subscribeToSaveResponse(this.materiaService.update(materia));
    } else {
      this.subscribeToSaveResponse(this.materiaService.create(materia));
    }
  }

  trackDocenteMateriaById(_index: number, item: IDocenteMateria): number {
    return item.id!;
  }

  trackSalaMateriaById(_index: number, item: ISalaMateria): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMateria>>): void {
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

  protected updateForm(materia: IMateria): void {
    this.editForm.patchValue({
      id: materia.id,
      nombreMateria: materia.nombreMateria,
      numeroPreguntas: materia.numeroPreguntas,
      pregunta: materia.pregunta,
      docenteMateria: materia.docenteMateria,
      salaMateria: materia.salaMateria,
    });

    this.docenteMateriasSharedCollection = this.docenteMateriaService.addDocenteMateriaToCollectionIfMissing(
      this.docenteMateriasSharedCollection,
      materia.docenteMateria
    );
    this.salaMateriasSharedCollection = this.salaMateriaService.addSalaMateriaToCollectionIfMissing(
      this.salaMateriasSharedCollection,
      materia.salaMateria
    );
  }

  protected loadRelationshipsOptions(): void {
    this.docenteMateriaService
      .query()
      .pipe(map((res: HttpResponse<IDocenteMateria[]>) => res.body ?? []))
      .pipe(
        map((docenteMaterias: IDocenteMateria[]) =>
          this.docenteMateriaService.addDocenteMateriaToCollectionIfMissing(docenteMaterias, this.editForm.get('docenteMateria')!.value)
        )
      )
      .subscribe((docenteMaterias: IDocenteMateria[]) => (this.docenteMateriasSharedCollection = docenteMaterias));

    this.salaMateriaService
      .query()
      .pipe(map((res: HttpResponse<ISalaMateria[]>) => res.body ?? []))
      .pipe(
        map((salaMaterias: ISalaMateria[]) =>
          this.salaMateriaService.addSalaMateriaToCollectionIfMissing(salaMaterias, this.editForm.get('salaMateria')!.value)
        )
      )
      .subscribe((salaMaterias: ISalaMateria[]) => (this.salaMateriasSharedCollection = salaMaterias));
  }

  protected createFromForm(): IMateria {
    return {
      ...new Materia(),
      id: this.editForm.get(['id'])!.value,
      nombreMateria: this.editForm.get(['nombreMateria'])!.value,
      numeroPreguntas: this.editForm.get(['numeroPreguntas'])!.value,
      pregunta: this.editForm.get(['pregunta'])!.value,
      docenteMateria: this.editForm.get(['docenteMateria'])!.value,
      salaMateria: this.editForm.get(['salaMateria'])!.value,
    };
  }
}
