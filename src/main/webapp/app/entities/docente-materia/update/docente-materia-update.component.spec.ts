import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DocenteMateriaService } from '../service/docente-materia.service';
import { IDocenteMateria, DocenteMateria } from '../docente-materia.model';

import { DocenteMateriaUpdateComponent } from './docente-materia-update.component';

describe('DocenteMateria Management Update Component', () => {
  let comp: DocenteMateriaUpdateComponent;
  let fixture: ComponentFixture<DocenteMateriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let docenteMateriaService: DocenteMateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DocenteMateriaUpdateComponent],
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
      .overrideTemplate(DocenteMateriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocenteMateriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    docenteMateriaService = TestBed.inject(DocenteMateriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const docenteMateria: IDocenteMateria = { id: 456 };

      activatedRoute.data = of({ docenteMateria });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(docenteMateria));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DocenteMateria>>();
      const docenteMateria = { id: 123 };
      jest.spyOn(docenteMateriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docenteMateria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: docenteMateria }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(docenteMateriaService.update).toHaveBeenCalledWith(docenteMateria);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DocenteMateria>>();
      const docenteMateria = new DocenteMateria();
      jest.spyOn(docenteMateriaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docenteMateria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: docenteMateria }));
      saveSubject.complete();

      // THEN
      expect(docenteMateriaService.create).toHaveBeenCalledWith(docenteMateria);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<DocenteMateria>>();
      const docenteMateria = { id: 123 };
      jest.spyOn(docenteMateriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docenteMateria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(docenteMateriaService.update).toHaveBeenCalledWith(docenteMateria);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
