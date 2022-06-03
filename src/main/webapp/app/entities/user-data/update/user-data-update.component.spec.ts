import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserDataService } from '../service/user-data.service';
import { IUserData, UserData } from '../user-data.model';
import { ITipoDocumento } from 'app/entities/tipo-documento/tipo-documento.model';
import { TipoDocumentoService } from 'app/entities/tipo-documento/service/tipo-documento.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserDataUpdateComponent } from './user-data-update.component';

describe('UserData Management Update Component', () => {
  let comp: UserDataUpdateComponent;
  let fixture: ComponentFixture<UserDataUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userDataService: UserDataService;
  let tipoDocumentoService: TipoDocumentoService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserDataUpdateComponent],
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
      .overrideTemplate(UserDataUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDataUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userDataService = TestBed.inject(UserDataService);
    tipoDocumentoService = TestBed.inject(TipoDocumentoService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call tipoDocumento query and add missing value', () => {
      const userData: IUserData = { id: 456 };
      const tipoDocumento: ITipoDocumento = { id: 83704 };
      userData.tipoDocumento = tipoDocumento;

      const tipoDocumentoCollection: ITipoDocumento[] = [{ id: 64450 }];
      jest.spyOn(tipoDocumentoService, 'query').mockReturnValue(of(new HttpResponse({ body: tipoDocumentoCollection })));
      const expectedCollection: ITipoDocumento[] = [tipoDocumento, ...tipoDocumentoCollection];
      jest.spyOn(tipoDocumentoService, 'addTipoDocumentoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userData });
      comp.ngOnInit();

      expect(tipoDocumentoService.query).toHaveBeenCalled();
      expect(tipoDocumentoService.addTipoDocumentoToCollectionIfMissing).toHaveBeenCalledWith(tipoDocumentoCollection, tipoDocumento);
      expect(comp.tipoDocumentosCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const userData: IUserData = { id: 456 };
      const user: IUser = { id: 92568 };
      userData.user = user;

      const userCollection: IUser[] = [{ id: 39630 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userData });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userData: IUserData = { id: 456 };
      const tipoDocumento: ITipoDocumento = { id: 8187 };
      userData.tipoDocumento = tipoDocumento;
      const user: IUser = { id: 53371 };
      userData.user = user;

      activatedRoute.data = of({ userData });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(userData));
      expect(comp.tipoDocumentosCollection).toContain(tipoDocumento);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserData>>();
      const userData = { id: 123 };
      jest.spyOn(userDataService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userData }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(userDataService.update).toHaveBeenCalledWith(userData);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserData>>();
      const userData = new UserData();
      jest.spyOn(userDataService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userData }));
      saveSubject.complete();

      // THEN
      expect(userDataService.create).toHaveBeenCalledWith(userData);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserData>>();
      const userData = { id: 123 };
      jest.spyOn(userDataService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userData });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userDataService.update).toHaveBeenCalledWith(userData);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTipoDocumentoById', () => {
      it('Should return tracked TipoDocumento primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTipoDocumentoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
