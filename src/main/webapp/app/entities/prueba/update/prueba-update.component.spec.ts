import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PruebaService } from '../service/prueba.service';
import { IPrueba, Prueba } from '../prueba.model';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/estudiante/service/estudiante.service';
import { IBancoPregunta } from 'app/entities/banco-pregunta/banco-pregunta.model';
import { BancoPreguntaService } from 'app/entities/banco-pregunta/service/banco-pregunta.service';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';

import { PruebaUpdateComponent } from './prueba-update.component';

describe('Prueba Management Update Component', () => {
  let comp: PruebaUpdateComponent;
  let fixture: ComponentFixture<PruebaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pruebaService: PruebaService;
  let estudianteService: EstudianteService;
  let bancoPreguntaService: BancoPreguntaService;
  let salaService: SalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PruebaUpdateComponent],
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
      .overrideTemplate(PruebaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PruebaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pruebaService = TestBed.inject(PruebaService);
    estudianteService = TestBed.inject(EstudianteService);
    bancoPreguntaService = TestBed.inject(BancoPreguntaService);
    salaService = TestBed.inject(SalaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Estudiante query and add missing value', () => {
      const prueba: IPrueba = { id: 456 };
      const estudiante: IEstudiante = { id: 49769 };
      prueba.estudiante = estudiante;

      const estudianteCollection: IEstudiante[] = [{ id: 27585 }];
      jest.spyOn(estudianteService, 'query').mockReturnValue(of(new HttpResponse({ body: estudianteCollection })));
      const additionalEstudiantes = [estudiante];
      const expectedCollection: IEstudiante[] = [...additionalEstudiantes, ...estudianteCollection];
      jest.spyOn(estudianteService, 'addEstudianteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prueba });
      comp.ngOnInit();

      expect(estudianteService.query).toHaveBeenCalled();
      expect(estudianteService.addEstudianteToCollectionIfMissing).toHaveBeenCalledWith(estudianteCollection, ...additionalEstudiantes);
      expect(comp.estudiantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BancoPregunta query and add missing value', () => {
      const prueba: IPrueba = { id: 456 };
      const bancoPregunta: IBancoPregunta = { id: 13748 };
      prueba.bancoPregunta = bancoPregunta;

      const bancoPreguntaCollection: IBancoPregunta[] = [{ id: 53052 }];
      jest.spyOn(bancoPreguntaService, 'query').mockReturnValue(of(new HttpResponse({ body: bancoPreguntaCollection })));
      const additionalBancoPreguntas = [bancoPregunta];
      const expectedCollection: IBancoPregunta[] = [...additionalBancoPreguntas, ...bancoPreguntaCollection];
      jest.spyOn(bancoPreguntaService, 'addBancoPreguntaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prueba });
      comp.ngOnInit();

      expect(bancoPreguntaService.query).toHaveBeenCalled();
      expect(bancoPreguntaService.addBancoPreguntaToCollectionIfMissing).toHaveBeenCalledWith(
        bancoPreguntaCollection,
        ...additionalBancoPreguntas
      );
      expect(comp.bancoPreguntasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Sala query and add missing value', () => {
      const prueba: IPrueba = { id: 456 };
      const sala: ISala = { id: 25076 };
      prueba.sala = sala;

      const salaCollection: ISala[] = [{ id: 61732 }];
      jest.spyOn(salaService, 'query').mockReturnValue(of(new HttpResponse({ body: salaCollection })));
      const additionalSalas = [sala];
      const expectedCollection: ISala[] = [...additionalSalas, ...salaCollection];
      jest.spyOn(salaService, 'addSalaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ prueba });
      comp.ngOnInit();

      expect(salaService.query).toHaveBeenCalled();
      expect(salaService.addSalaToCollectionIfMissing).toHaveBeenCalledWith(salaCollection, ...additionalSalas);
      expect(comp.salasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const prueba: IPrueba = { id: 456 };
      const estudiante: IEstudiante = { id: 49354 };
      prueba.estudiante = estudiante;
      const bancoPregunta: IBancoPregunta = { id: 17483 };
      prueba.bancoPregunta = bancoPregunta;
      const sala: ISala = { id: 79728 };
      prueba.sala = sala;

      activatedRoute.data = of({ prueba });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(prueba));
      expect(comp.estudiantesSharedCollection).toContain(estudiante);
      expect(comp.bancoPreguntasSharedCollection).toContain(bancoPregunta);
      expect(comp.salasSharedCollection).toContain(sala);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Prueba>>();
      const prueba = { id: 123 };
      jest.spyOn(pruebaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prueba });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prueba }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(pruebaService.update).toHaveBeenCalledWith(prueba);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Prueba>>();
      const prueba = new Prueba();
      jest.spyOn(pruebaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prueba });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: prueba }));
      saveSubject.complete();

      // THEN
      expect(pruebaService.create).toHaveBeenCalledWith(prueba);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Prueba>>();
      const prueba = { id: 123 };
      jest.spyOn(pruebaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prueba });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pruebaService.update).toHaveBeenCalledWith(prueba);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEstudianteById', () => {
      it('Should return tracked Estudiante primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEstudianteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBancoPreguntaById', () => {
      it('Should return tracked BancoPregunta primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBancoPreguntaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSalaById', () => {
      it('Should return tracked Sala primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSalaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
