import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDocenteMateria, DocenteMateria } from '../docente-materia.model';
import { DocenteMateriaService } from '../service/docente-materia.service';

@Component({
  selector: 'ss-35-docente-materia-update',
  templateUrl: './docente-materia-update.component.html',
})
export class DocenteMateriaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idDocente: [],
    idMateria: [],
  });

  constructor(
    protected docenteMateriaService: DocenteMateriaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ docenteMateria }) => {
      this.updateForm(docenteMateria);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const docenteMateria = this.createFromForm();
    if (docenteMateria.id !== undefined) {
      this.subscribeToSaveResponse(this.docenteMateriaService.update(docenteMateria));
    } else {
      this.subscribeToSaveResponse(this.docenteMateriaService.create(docenteMateria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocenteMateria>>): void {
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

  protected updateForm(docenteMateria: IDocenteMateria): void {
    this.editForm.patchValue({
      id: docenteMateria.id,
      idDocente: docenteMateria.idDocente,
      idMateria: docenteMateria.idMateria,
    });
  }

  protected createFromForm(): IDocenteMateria {
    return {
      ...new DocenteMateria(),
      id: this.editForm.get(['id'])!.value,
      idDocente: this.editForm.get(['idDocente'])!.value,
      idMateria: this.editForm.get(['idMateria'])!.value,
    };
  }
}
