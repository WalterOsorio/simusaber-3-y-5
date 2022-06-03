import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BancoPreguntaService } from '../service/banco-pregunta.service';
import { IBancoPregunta, BancoPregunta } from '../banco-pregunta.model';
import { IAdmiBancoP } from 'app/entities/admi-banco-p/admi-banco-p.model';
import { AdmiBancoPService } from 'app/entities/admi-banco-p/service/admi-banco-p.service';

import { BancoPreguntaUpdateComponent } from './banco-pregunta-update.component';

describe('BancoPregunta Management Update Component', () => {
  let comp: BancoPreguntaUpdateComponent;
  let fixture: ComponentFixture<BancoPreguntaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bancoPreguntaService: BancoPreguntaService;
  let admiBancoPService: AdmiBancoPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BancoPreguntaUpdateComponent],
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
      .overrideTemplate(BancoPreguntaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BancoPreguntaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bancoPreguntaService = TestBed.inject(BancoPreguntaService);
    admiBancoPService = TestBed.inject(AdmiBancoPService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AdmiBancoP query and add missing value', () => {
      const bancoPregunta: IBancoPregunta = { id: 456 };
      const admiBancoP: IAdmiBancoP = { id: 24593 };
      bancoPregunta.admiBancoP = admiBancoP;

      const admiBancoPCollection: IAdmiBancoP[] = [{ id: 73229 }];
      jest.spyOn(admiBancoPService, 'query').mockReturnValue(of(new HttpResponse({ body: admiBancoPCollection })));
      const additionalAdmiBancoPS = [admiBancoP];
      const expectedCollection: IAdmiBancoP[] = [...additionalAdmiBancoPS, ...admiBancoPCollection];
      jest.spyOn(admiBancoPService, 'addAdmiBancoPToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bancoPregunta });
      comp.ngOnInit();

      expect(admiBancoPService.query).toHaveBeenCalled();
      expect(admiBancoPService.addAdmiBancoPToCollectionIfMissing).toHaveBeenCalledWith(admiBancoPCollection, ...additionalAdmiBancoPS);
      expect(comp.admiBancoPSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bancoPregunta: IBancoPregunta = { id: 456 };
      const admiBancoP: IAdmiBancoP = { id: 13241 };
      bancoPregunta.admiBancoP = admiBancoP;

      activatedRoute.data = of({ bancoPregunta });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bancoPregunta));
      expect(comp.admiBancoPSSharedCollection).toContain(admiBancoP);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BancoPregunta>>();
      const bancoPregunta = { id: 123 };
      jest.spyOn(bancoPreguntaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bancoPregunta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bancoPregunta }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bancoPreguntaService.update).toHaveBeenCalledWith(bancoPregunta);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BancoPregunta>>();
      const bancoPregunta = new BancoPregunta();
      jest.spyOn(bancoPreguntaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bancoPregunta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bancoPregunta }));
      saveSubject.complete();

      // THEN
      expect(bancoPreguntaService.create).toHaveBeenCalledWith(bancoPregunta);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BancoPregunta>>();
      const bancoPregunta = { id: 123 };
      jest.spyOn(bancoPreguntaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bancoPregunta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bancoPreguntaService.update).toHaveBeenCalledWith(bancoPregunta);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAdmiBancoPById', () => {
      it('Should return tracked AdmiBancoP primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAdmiBancoPById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
