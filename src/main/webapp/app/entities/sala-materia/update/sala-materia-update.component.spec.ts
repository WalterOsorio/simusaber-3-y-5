import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SalaMateriaService } from '../service/sala-materia.service';
import { ISalaMateria, SalaMateria } from '../sala-materia.model';

import { SalaMateriaUpdateComponent } from './sala-materia-update.component';

describe('SalaMateria Management Update Component', () => {
  let comp: SalaMateriaUpdateComponent;
  let fixture: ComponentFixture<SalaMateriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let salaMateriaService: SalaMateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SalaMateriaUpdateComponent],
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
      .overrideTemplate(SalaMateriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalaMateriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    salaMateriaService = TestBed.inject(SalaMateriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const salaMateria: ISalaMateria = { id: 456 };

      activatedRoute.data = of({ salaMateria });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(salaMateria));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SalaMateria>>();
      const salaMateria = { id: 123 };
      jest.spyOn(salaMateriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salaMateria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: salaMateria }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(salaMateriaService.update).toHaveBeenCalledWith(salaMateria);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SalaMateria>>();
      const salaMateria = new SalaMateria();
      jest.spyOn(salaMateriaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salaMateria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: salaMateria }));
      saveSubject.complete();

      // THEN
      expect(salaMateriaService.create).toHaveBeenCalledWith(salaMateria);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SalaMateria>>();
      const salaMateria = { id: 123 };
      jest.spyOn(salaMateriaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salaMateria });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(salaMateriaService.update).toHaveBeenCalledWith(salaMateria);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
