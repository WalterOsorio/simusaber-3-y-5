import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AdministradorService } from '../service/administrador.service';
import { IAdministrador, Administrador } from '../administrador.model';
import { IUserData } from 'app/entities/user-data/user-data.model';
import { UserDataService } from 'app/entities/user-data/service/user-data.service';
import { IAdmiBancoP } from 'app/entities/admi-banco-p/admi-banco-p.model';
import { AdmiBancoPService } from 'app/entities/admi-banco-p/service/admi-banco-p.service';

import { AdministradorUpdateComponent } from './administrador-update.component';

describe('Administrador Management Update Component', () => {
  let comp: AdministradorUpdateComponent;
  let fixture: ComponentFixture<AdministradorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let administradorService: AdministradorService;
  let userDataService: UserDataService;
  let admiBancoPService: AdmiBancoPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AdministradorUpdateComponent],
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
      .overrideTemplate(AdministradorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdministradorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    administradorService = TestBed.inject(AdministradorService);
    userDataService = TestBed.inject(UserDataService);
    admiBancoPService = TestBed.inject(AdmiBancoPService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call userData query and add missing value', () => {
      const administrador: IAdministrador = { id: 456 };
      const userData: IUserData = { id: 45961 };
      administrador.userData = userData;

      const userDataCollection: IUserData[] = [{ id: 54670 }];
      jest.spyOn(userDataService, 'query').mockReturnValue(of(new HttpResponse({ body: userDataCollection })));
      const expectedCollection: IUserData[] = [userData, ...userDataCollection];
      jest.spyOn(userDataService, 'addUserDataToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ administrador });
      comp.ngOnInit();

      expect(userDataService.query).toHaveBeenCalled();
      expect(userDataService.addUserDataToCollectionIfMissing).toHaveBeenCalledWith(userDataCollection, userData);
      expect(comp.userDataCollection).toEqual(expectedCollection);
    });

    it('Should call AdmiBancoP query and add missing value', () => {
      const administrador: IAdministrador = { id: 456 };
      const admiBancoP: IAdmiBancoP = { id: 3964 };
      administrador.admiBancoP = admiBancoP;

      const admiBancoPCollection: IAdmiBancoP[] = [{ id: 99555 }];
      jest.spyOn(admiBancoPService, 'query').mockReturnValue(of(new HttpResponse({ body: admiBancoPCollection })));
      const additionalAdmiBancoPS = [admiBancoP];
      const expectedCollection: IAdmiBancoP[] = [...additionalAdmiBancoPS, ...admiBancoPCollection];
      jest.spyOn(admiBancoPService, 'addAdmiBancoPToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ administrador });
      comp.ngOnInit();

      expect(admiBancoPService.query).toHaveBeenCalled();
      expect(admiBancoPService.addAdmiBancoPToCollectionIfMissing).toHaveBeenCalledWith(admiBancoPCollection, ...additionalAdmiBancoPS);
      expect(comp.admiBancoPSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const administrador: IAdministrador = { id: 456 };
      const userData: IUserData = { id: 62671 };
      administrador.userData = userData;
      const admiBancoP: IAdmiBancoP = { id: 12180 };
      administrador.admiBancoP = admiBancoP;

      activatedRoute.data = of({ administrador });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(administrador));
      expect(comp.userDataCollection).toContain(userData);
      expect(comp.admiBancoPSSharedCollection).toContain(admiBancoP);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Administrador>>();
      const administrador = { id: 123 };
      jest.spyOn(administradorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administrador });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: administrador }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(administradorService.update).toHaveBeenCalledWith(administrador);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Administrador>>();
      const administrador = new Administrador();
      jest.spyOn(administradorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administrador });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: administrador }));
      saveSubject.complete();

      // THEN
      expect(administradorService.create).toHaveBeenCalledWith(administrador);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Administrador>>();
      const administrador = { id: 123 };
      jest.spyOn(administradorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ administrador });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(administradorService.update).toHaveBeenCalledWith(administrador);
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

    describe('trackAdmiBancoPById', () => {
      it('Should return tracked AdmiBancoP primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAdmiBancoPById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
