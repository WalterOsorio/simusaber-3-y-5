import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EstudianteService } from '../service/estudiante.service';
import { IEstudiante, Estudiante } from '../estudiante.model';
import { IUserData } from 'app/entities/user-data/user-data.model';
import { UserDataService } from 'app/entities/user-data/service/user-data.service';
import { ISala } from 'app/entities/sala/sala.model';
import { SalaService } from 'app/entities/sala/service/sala.service';
import { IEstudianteSala } from 'app/entities/estudiante-sala/estudiante-sala.model';
import { EstudianteSalaService } from 'app/entities/estudiante-sala/service/estudiante-sala.service';

import { EstudianteUpdateComponent } from './estudiante-update.component';

describe('Estudiante Management Update Component', () => {
  let comp: EstudianteUpdateComponent;
  let fixture: ComponentFixture<EstudianteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estudianteService: EstudianteService;
  let userDataService: UserDataService;
  let salaService: SalaService;
  let estudianteSalaService: EstudianteSalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EstudianteUpdateComponent],
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
      .overrideTemplate(EstudianteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estudianteService = TestBed.inject(EstudianteService);
    userDataService = TestBed.inject(UserDataService);
    salaService = TestBed.inject(SalaService);
    estudianteSalaService = TestBed.inject(EstudianteSalaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call userData query and add missing value', () => {
      const estudiante: IEstudiante = { id: 456 };
      const userData: IUserData = { id: 52639 };
      estudiante.userData = userData;

      const userDataCollection: IUserData[] = [{ id: 31448 }];
      jest.spyOn(userDataService, 'query').mockReturnValue(of(new HttpResponse({ body: userDataCollection })));
      const expectedCollection: IUserData[] = [userData, ...userDataCollection];
      jest.spyOn(userDataService, 'addUserDataToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(userDataService.query).toHaveBeenCalled();
      expect(userDataService.addUserDataToCollectionIfMissing).toHaveBeenCalledWith(userDataCollection, userData);
      expect(comp.userDataCollection).toEqual(expectedCollection);
    });

    it('Should call Sala query and add missing value', () => {
      const estudiante: IEstudiante = { id: 456 };
      const salas: ISala[] = [{ id: 16441 }];
      estudiante.salas = salas;

      const salaCollection: ISala[] = [{ id: 45512 }];
      jest.spyOn(salaService, 'query').mockReturnValue(of(new HttpResponse({ body: salaCollection })));
      const additionalSalas = [...salas];
      const expectedCollection: ISala[] = [...additionalSalas, ...salaCollection];
      jest.spyOn(salaService, 'addSalaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(salaService.query).toHaveBeenCalled();
      expect(salaService.addSalaToCollectionIfMissing).toHaveBeenCalledWith(salaCollection, ...additionalSalas);
      expect(comp.salasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call EstudianteSala query and add missing value', () => {
      const estudiante: IEstudiante = { id: 456 };
      const estudianteSala: IEstudianteSala = { id: 6906 };
      estudiante.estudianteSala = estudianteSala;

      const estudianteSalaCollection: IEstudianteSala[] = [{ id: 94376 }];
      jest.spyOn(estudianteSalaService, 'query').mockReturnValue(of(new HttpResponse({ body: estudianteSalaCollection })));
      const additionalEstudianteSalas = [estudianteSala];
      const expectedCollection: IEstudianteSala[] = [...additionalEstudianteSalas, ...estudianteSalaCollection];
      jest.spyOn(estudianteSalaService, 'addEstudianteSalaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(estudianteSalaService.query).toHaveBeenCalled();
      expect(estudianteSalaService.addEstudianteSalaToCollectionIfMissing).toHaveBeenCalledWith(
        estudianteSalaCollection,
        ...additionalEstudianteSalas
      );
      expect(comp.estudianteSalasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const estudiante: IEstudiante = { id: 456 };
      const userData: IUserData = { id: 94740 };
      estudiante.userData = userData;
      const salas: ISala = { id: 88344 };
      estudiante.salas = [salas];
      const estudianteSala: IEstudianteSala = { id: 44442 };
      estudiante.estudianteSala = estudianteSala;

      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(estudiante));
      expect(comp.userDataCollection).toContain(userData);
      expect(comp.salasSharedCollection).toContain(salas);
      expect(comp.estudianteSalasSharedCollection).toContain(estudianteSala);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estudiante>>();
      const estudiante = { id: 123 };
      jest.spyOn(estudianteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudiante }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(estudianteService.update).toHaveBeenCalledWith(estudiante);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estudiante>>();
      const estudiante = new Estudiante();
      jest.spyOn(estudianteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estudiante }));
      saveSubject.complete();

      // THEN
      expect(estudianteService.create).toHaveBeenCalledWith(estudiante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estudiante>>();
      const estudiante = { id: 123 };
      jest.spyOn(estudianteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estudiante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estudianteService.update).toHaveBeenCalledWith(estudiante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserDataById', () => {
      it('Should return tracked UserData primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserDataById(0, entity);
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

    describe('trackEstudianteSalaById', () => {
      it('Should return tracked EstudianteSala primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEstudianteSalaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedSala', () => {
      it('Should return option if no Sala is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedSala(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Sala for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedSala(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Sala is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedSala(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
