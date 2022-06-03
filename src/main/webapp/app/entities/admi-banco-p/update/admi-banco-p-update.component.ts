import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAdmiBancoP, AdmiBancoP } from '../admi-banco-p.model';
import { AdmiBancoPService } from '../service/admi-banco-p.service';

@Component({
  selector: 'ss-35-admi-banco-p-update',
  templateUrl: './admi-banco-p-update.component.html',
})
export class AdmiBancoPUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idAdministrador: [],
    idBancoPregunta: [],
  });

  constructor(protected admiBancoPService: AdmiBancoPService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ admiBancoP }) => {
      this.updateForm(admiBancoP);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const admiBancoP = this.createFromForm();
    if (admiBancoP.id !== undefined) {
      this.subscribeToSaveResponse(this.admiBancoPService.update(admiBancoP));
    } else {
      this.subscribeToSaveResponse(this.admiBancoPService.create(admiBancoP));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdmiBancoP>>): void {
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

  protected updateForm(admiBancoP: IAdmiBancoP): void {
    this.editForm.patchValue({
      id: admiBancoP.id,
      idAdministrador: admiBancoP.idAdministrador,
      idBancoPregunta: admiBancoP.idBancoPregunta,
    });
  }

  protected createFromForm(): IAdmiBancoP {
    return {
      ...new AdmiBancoP(),
      id: this.editForm.get(['id'])!.value,
      idAdministrador: this.editForm.get(['idAdministrador'])!.value,
      idBancoPregunta: this.editForm.get(['idBancoPregunta'])!.value,
    };
  }
}
