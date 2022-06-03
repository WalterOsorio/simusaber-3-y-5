import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISalaMateria, SalaMateria } from '../sala-materia.model';
import { SalaMateriaService } from '../service/sala-materia.service';

@Component({
  selector: 'ss-35-sala-materia-update',
  templateUrl: './sala-materia-update.component.html',
})
export class SalaMateriaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idSala: [],
    idMateria: [],
  });

  constructor(protected salaMateriaService: SalaMateriaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salaMateria }) => {
      this.updateForm(salaMateria);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const salaMateria = this.createFromForm();
    if (salaMateria.id !== undefined) {
      this.subscribeToSaveResponse(this.salaMateriaService.update(salaMateria));
    } else {
      this.subscribeToSaveResponse(this.salaMateriaService.create(salaMateria));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISalaMateria>>): void {
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

  protected updateForm(salaMateria: ISalaMateria): void {
    this.editForm.patchValue({
      id: salaMateria.id,
      idSala: salaMateria.idSala,
      idMateria: salaMateria.idMateria,
    });
  }

  protected createFromForm(): ISalaMateria {
    return {
      ...new SalaMateria(),
      id: this.editForm.get(['id'])!.value,
      idSala: this.editForm.get(['idSala'])!.value,
      idMateria: this.editForm.get(['idMateria'])!.value,
    };
  }
}
