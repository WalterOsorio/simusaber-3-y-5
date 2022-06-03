import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TipoDocumentoService } from '../service/tipo-documento.service';
import { ITipoDocumento, TipoDocumento } from '../tipo-documento.model';

import { TipoDocumentoUpdateComponent } from './tipo-documento-update.component';

describe('TipoDocumento Management Update Component', () => {
  let comp: TipoDocumentoUpdateComponent;
  let fixture: ComponentFixture<TipoDocumentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tipoDocumentoService: TipoDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TipoDocumentoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TipoDocumentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoDocumentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tipoDocumentoService = TestBed.inject(TipoDocumentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tipoDocumento: ITipoDocumento = { id: 456 };

      activatedRoute.data = of({ tipoDocumento });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(tipoDocumento));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TipoDocumento>>();
      const tipoDocumento = { id: 123 };
      jest.spyOn(tipoDocumentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDocumento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoDocumento }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(tipoDocumentoService.update).toHaveBeenCalledWith(tipoDocumento);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TipoDocumento>>();
      const tipoDocumento = new TipoDocumento();
      jest.spyOn(tipoDocumentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDocumento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoDocumento }));
      saveSubject.complete();

      // THEN
      expect(tipoDocumentoService.create).toHaveBeenCalledWith(tipoDocumento);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TipoDocumento>>();
      const tipoDocumento = { id: 123 };
      jest.spyOn(tipoDocumentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDocumento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tipoDocumentoService.update).toHaveBeenCalledWith(tipoDocumento);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
