import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SalaService } from '../service/sala.service';
import { ISala, Sala } from '../sala.model';
import { ISalaMateria } from 'app/entities/sala-materia/sala-materia.model';
import { SalaMateriaService } from 'app/entities/sala-materia/service/sala-materia.service';
import { IDocente } from 'app/entities/docente/docente.model';
import { DocenteService } from 'app/entities/docente/service/docente.service';
import { IEstudianteSala } from 'app/entities/estudiante-sala/estudiante-sala.model';
import { EstudianteSalaService } from 'app/entities/estudiante-sala/service/estudiante-sala.service';

import { SalaUpdateComponent } from './sala-update.component';

describe('Sala Management Update Component', () => {
  let comp: SalaUpdateComponent;
  let fixture: ComponentFixture<SalaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let salaService: SalaService;
  let salaMateriaService: SalaMateriaService;
  let docenteService: DocenteService;
  let estudianteSalaService: EstudianteSalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SalaUpdateComponent],
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
      .overrideTemplate(SalaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    salaService = TestBed.inject(SalaService);
    salaMateriaService = TestBed.inject(SalaMateriaService);
    docenteService = TestBed.inject(DocenteService);
    estudianteSalaService = TestBed.inject(EstudianteSalaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SalaMateria query and add missing value', () => {
      const sala: ISala = { id: 456 };
      const salaMateria: ISalaMateria = { id: 73400 };
      sala.salaMateria = salaMateria;

      const salaMateriaCollection: ISalaMateria[] = [{ id: 12131 }];
      jest.spyOn(salaMateriaService, 'query').mockReturnValue(of(new HttpResponse({ body: salaMateriaCollection })));
      const additionalSalaMaterias = [salaMateria];
      const expectedCollection: ISalaMateria[] = [...additionalSalaMaterias, ...salaMateriaCollection];
      jest.spyOn(salaMateriaService, 'addSalaMateriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      expect(salaMateriaService.query).toHaveBeenCalled();
      expect(salaMateriaService.addSalaMateriaToCollectionIfMissing).toHaveBeenCalledWith(salaMateriaCollection, ...additionalSalaMaterias);
      expect(comp.salaMateriasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Docente query and add missing value', () => {
      const sala: ISala = { id: 456 };
      const docente: IDocente = { id: 17686 };
      sala.docente = docente;

      const docenteCollection: IDocente[] = [{ id: 34025 }];
      jest.spyOn(docenteService, 'query').mockReturnValue(of(new HttpResponse({ body: docenteCollection })));
      const additionalDocentes = [docente];
      const expectedCollection: IDocente[] = [...additionalDocentes, ...docenteCollection];
      jest.spyOn(docenteService, 'addDocenteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      expect(docenteService.query).toHaveBeenCalled();
      expect(docenteService.addDocenteToCollectionIfMissing).toHaveBeenCalledWith(docenteCollection, ...additionalDocentes);
      expect(comp.docentesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call EstudianteSala query and add missing value', () => {
      const sala: ISala = { id: 456 };
      const estudianteSala: IEstudianteSala = { id: 58870 };
      sala.estudianteSala = estudianteSala;

      const estudianteSalaCollection: IEstudianteSala[] = [{ id: 33160 }];
      jest.spyOn(estudianteSalaService, 'query').mockReturnValue(of(new HttpResponse({ body: estudianteSalaCollection })));
      const additionalEstudianteSalas = [estudianteSala];
      const expectedCollection: IEstudianteSala[] = [...additionalEstudianteSalas, ...estudianteSalaCollection];
      jest.spyOn(estudianteSalaService, 'addEstudianteSalaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      expect(estudianteSalaService.query).toHaveBeenCalled();
      expect(estudianteSalaService.addEstudianteSalaToCollectionIfMissing).toHaveBeenCalledWith(
        estudianteSalaCollection,
        ...additionalEstudianteSalas
      );
      expect(comp.estudianteSalasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sala: ISala = { id: 456 };
      const salaMateria: ISalaMateria = { id: 84504 };
      sala.salaMateria = salaMateria;
      const docente: IDocente = { id: 58631 };
      sala.docente = docente;
      const estudianteSala: IEstudianteSala = { id: 76796 };
      sala.estudianteSala = estudianteSala;

      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sala));
      expect(comp.salaMateriasSharedCollection).toContain(salaMateria);
      expect(comp.docentesSharedCollection).toContain(docente);
      expect(comp.estudianteSalasSharedCollection).toContain(estudianteSala);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sala>>();
      const sala = { id: 123 };
      jest.spyOn(salaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sala }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(salaService.update).toHaveBeenCalledWith(sala);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sala>>();
      const sala = new Sala();
      jest.spyOn(salaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sala }));
      saveSubject.complete();

      // THEN
      expect(salaService.create).toHaveBeenCalledWith(sala);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Sala>>();
      const sala = { id: 123 };
      jest.spyOn(salaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sala });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(salaService.update).toHaveBeenCalledWith(sala);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSalaMateriaById', () => {
      it('Should return tracked SalaMateria primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSalaMateriaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDocenteById', () => {
      it('Should return tracked Docente primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDocenteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEstudianteSalaById', () => {
      it('Should return tracked EstudianteSala primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEstudianteSalaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
