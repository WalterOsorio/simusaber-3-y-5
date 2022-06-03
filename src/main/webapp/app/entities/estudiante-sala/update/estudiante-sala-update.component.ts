import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEstudianteSala, EstudianteSala } from '../estudiante-sala.model';
import { EstudianteSalaService } from '../service/estudiante-sala.service';

@Component({
  selector: 'ss-35-estudiante-sala-update',
  templateUrl: './estudiante-sala-update.component.html',
})
export class EstudianteSalaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idEstudiante: [],
    idSala: [],
  });

  constructor(
    protected estudianteSalaService: EstudianteSalaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudianteSala }) => {
      this.updateForm(estudianteSala);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estudianteSala = this.createFromForm();
    if (estudianteSala.id !== undefined) {
      this.subscribeToSaveResponse(this.estudianteSalaService.update(estudianteSala));
    } else {
      this.subscribeToSaveResponse(this.estudianteSalaService.create(estudianteSala));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstudianteSala>>): void {
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

  protected updateForm(estudianteSala: IEstudianteSala): void {
    this.editForm.patchValue({
      id: estudianteSala.id,
      idEstudiante: estudianteSala.idEstudiante,
      idSala: estudianteSala.idSala,
    });
  }

  protected createFromForm(): IEstudianteSala {
    return {
      ...new EstudianteSala(),
      id: this.editForm.get(['id'])!.value,
      idEstudiante: this.editForm.get(['idEstudiante'])!.value,
      idSala: this.editForm.get(['idSala'])!.value,
    };
  }
}
