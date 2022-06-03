import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MateriaService } from '../service/materia.service';
import { IMateria, Materia } from '../materia.model';
import { IDocenteMateria } from 'app/entities/docente-materia/docente-materia.model';
import { DocenteMateriaService } from 'app/entities/docente-materia/service/docente-materia.service';
import { ISalaMateria } from 'app/entities/sala-materia/sala-materia.model';
import { SalaMateriaService } from 'app/entities/sala-materia/service/sala-materia.service';

import { MateriaUpdateComponent } from './materia-update.component';

describe('Materia Management Update Component', () => {
  let comp: MateriaUpdateComponent;
  let fixture: ComponentFixture<MateriaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let materiaService: MateriaService;
  let docenteMateriaService: DocenteMateriaService;
  let salaMateriaService: SalaMateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MateriaUpdateComponent],
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
      .overrideTemplate(MateriaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MateriaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    materiaService = TestBed.inject(MateriaService);
    docenteMateriaService = TestBed.inject(DocenteMateriaService);
    salaMateriaService = TestBed.inject(SalaMateriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DocenteMateria query and add missing value', () => {
      const materia: IMateria = { id: 456 };
      const docenteMateria: IDocenteMateria = { id: 24378 };
      materia.docenteMateria = docenteMateria;

      const docenteMateriaCollection: IDocenteMateria[] = [{ id: 66271 }];
      jest.spyOn(docenteMateriaService, 'query').mockReturnValue(of(new HttpResponse({ body: docenteMateriaCollection })));
      const additionalDocenteMaterias = [docenteMateria];
      const expectedCollection: IDocenteMateria[] = [...additionalDocenteMaterias, ...docenteMateriaCollection];
      jest.spyOn(docenteMateriaService, 'addDocenteMateriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ materia });
      comp.ngOnInit();

      expect(docenteMateriaService.query).toHaveBeenCalled();
      expect(docenteMateriaService.addDocenteMateriaToCollectionIfMissing).toHaveBeenCalledWith(
        docenteMateriaCollection,
        ...additionalDocenteMaterias
      );
      expect(comp.docenteMateriasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call SalaMateria query and add missing value', () => {
      const materia: IMateria = { id: 456 };
      const salaMateria: ISalaMateria = { id: 58173 };
      materia.salaMateria = salaMateria;

      const salaMateriaCollection: ISalaMateria[] = [{ id: 3607 }];
      jest.spyOn(salaMateriaService, 'query').mockReturnValue(of(new HttpResponse({ body: salaMateriaCollection })));
      const additionalSalaMaterias = [salaMateria];
      const expectedCollection: ISalaMateria[] = [...additionalSalaMaterias, ...salaMateriaCollection];
      jest.spyOn(salaMateriaService, 'addSalaMateriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ materia });
      comp.ngOnInit();

      expect(salaMateriaService.query).toHaveBeenCalled();
      expect(salaMateriaService.addSalaMateriaToCollectionIfMissing).toHaveBeenCalledWith(salaMateriaCollection, ...additionalSalaMaterias);
      expect(comp.salaMateriasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const materia: IMateria = { id: 456 };
      const docenteMateria: IDocenteMateria = { id: 15737 };
      materia.docenteMateria = docenteMateria;
      const salaMateria: ISalaMateria = { id: 26118 };
      materia.salaMateria = salaMateria;

      activatedRoute.data = of({ materia });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(materia));
      expect(comp.docenteMateriasSharedCollection).toContain(docenteMateria);
      expect(comp.salaMateriasSharedCollection).toContain(salaMateria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Materia>>();
      const materia = { id: 123 };
      jest.spyOn(materiaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ materia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: materia }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(materiaService.update).toHaveBeenCalledWith(materia);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Materia>>();
      const materia = new Materia();
      jest.spyOn(materiaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ materia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: materia }));
      saveSubject.complete();

      // THEN
      expect(materiaService.create).toHaveBeenCalledWith(materia);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Materia>>();
      const materia = { id: 123 };
      jest.spyOn(materiaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ materia });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(materiaService.update).toHaveBeenCalledWith(materia);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDocenteMateriaById', () => {
      it('Should return tracked DocenteMateria primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDocenteMateriaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSalaMateriaById', () => {
      it('Should return tracked SalaMateria primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSalaMateriaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
