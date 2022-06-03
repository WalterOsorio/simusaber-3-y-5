import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PruebaApoyoService } from '../service/prueba-apoyo.service';
import { IPruebaApoyo, PruebaApoyo } from '../prueba-apoyo.model';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { EstudianteService } from 'app/entities/estudiante/service/estudiante.service';
import { IBancoPregunta } from 'app/entities/banco-pregunta/banco-pregunta.model';
import { BancoPreguntaService } from 'app/entities/banco-pregunta/service/banco-pregunta.service';

import { PruebaApoyoUpdateComponent } from './prueba-apoyo-update.component';

describe('PruebaApoyo Management Update Component', () => {
  let comp: PruebaApoyoUpdateComponent;
  let fixture: ComponentFixture<PruebaApoyoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pruebaApoyoService: PruebaApoyoService;
  let estudianteService: EstudianteService;
  let bancoPreguntaService: BancoPreguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PruebaApoyoUpdateComponent],
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
      .overrideTemplate(PruebaApoyoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PruebaApoyoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pruebaApoyoService = TestBed.inject(PruebaApoyoService);
    estudianteService = TestBed.inject(EstudianteService);
    bancoPreguntaService = TestBed.inject(BancoPreguntaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Estudiante query and add missing value', () => {
      const pruebaApoyo: IPruebaApoyo = { id: 456 };
      const estudiante: IEstudiante = { id: 34168 };
      pruebaApoyo.estudiante = estudiante;

      const estudianteCollection: IEstudiante[] = [{ id: 84667 }];
      jest.spyOn(estudianteService, 'query').mockReturnValue(of(new HttpResponse({ body: estudianteCollection })));
      const additionalEstudiantes = [estudiante];
      const expectedCollection: IEstudiante[] = [...additionalEstudiantes, ...estudianteCollection];
      jest.spyOn(estudianteService, 'addEstudianteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pruebaApoyo });
      comp.ngOnInit();

      expect(estudianteService.query).toHaveBeenCalled();
      expect(estudianteService.addEstudianteToCollectionIfMissing).toHaveBeenCalledWith(estudianteCollection, ...additionalEstudiantes);
      expect(comp.estudiantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BancoPregunta query and add missing value', () => {
      const pruebaApoyo: IPruebaApoyo = { id: 456 };
      const bancoPregunta: IBancoPregunta = { id: 46926 };
      pruebaApoyo.bancoPregunta = bancoPregunta;

      const bancoPreguntaCollection: IBancoPregunta[] = [{ id: 37145 }];
      jest.spyOn(bancoPreguntaService, 'query').mockReturnValue(of(new HttpResponse({ body: bancoPreguntaCollection })));
      const additionalBancoPreguntas = [bancoPregunta];
      const expectedCollection: IBancoPregunta[] = [...additionalBancoPreguntas, ...bancoPreguntaCollection];
      jest.spyOn(bancoPreguntaService, 'addBancoPreguntaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pruebaApoyo });
      comp.ngOnInit();

      expect(bancoPreguntaService.query).toHaveBeenCalled();
      expect(bancoPreguntaService.addBancoPreguntaToCollectionIfMissing).toHaveBeenCalledWith(
        bancoPreguntaCollection,
        ...additionalBancoPreguntas
      );
      expect(comp.bancoPreguntasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pruebaApoyo: IPruebaApoyo = { id: 456 };
      const estudiante: IEstudiante = { id: 52436 };
      pruebaApoyo.estudiante = estudiante;
      const bancoPregunta: IBancoPregunta = { id: 76339 };
      pruebaApoyo.bancoPregunta = bancoPregunta;

      activatedRoute.data = of({ pruebaApoyo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(pruebaApoyo));
      expect(comp.estudiantesSharedCollection).toContain(estudiante);
      expect(comp.bancoPreguntasSharedCollection).toContain(bancoPregunta);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PruebaApoyo>>();
      const pruebaApoyo = { id: 123 };
      jest.spyOn(pruebaApoyoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pruebaApoyo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pruebaApoyo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(pruebaApoyoService.update).toHaveBeenCalledWith(pruebaApoyo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PruebaApoyo>>();
      const pruebaApoyo = new PruebaApoyo();
      jest.spyOn(pruebaApoyoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pruebaApoyo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pruebaApoyo }));
      saveSubject.complete();

      // THEN
      expect(pruebaApoyoService.create).toHaveBeenCalledWith(pruebaApoyo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PruebaApoyo>>();
      const pruebaApoyo = { id: 123 };
      jest.spyOn(pruebaApoyoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pruebaApoyo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pruebaApoyoService.update).toHaveBeenCalledWith(pruebaApoyo);
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
  });
});
