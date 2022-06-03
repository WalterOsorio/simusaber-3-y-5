import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AdmiBancoPService } from '../service/admi-banco-p.service';
import { IAdmiBancoP, AdmiBancoP } from '../admi-banco-p.model';

import { AdmiBancoPUpdateComponent } from './admi-banco-p-update.component';

describe('AdmiBancoP Management Update Component', () => {
  let comp: AdmiBancoPUpdateComponent;
  let fixture: ComponentFixture<AdmiBancoPUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let admiBancoPService: AdmiBancoPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AdmiBancoPUpdateComponent],
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
      .overrideTemplate(AdmiBancoPUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdmiBancoPUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    admiBancoPService = TestBed.inject(AdmiBancoPService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const admiBancoP: IAdmiBancoP = { id: 456 };

      activatedRoute.data = of({ admiBancoP });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(admiBancoP));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdmiBancoP>>();
      const admiBancoP = { id: 123 };
      jest.spyOn(admiBancoPService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ admiBancoP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: admiBancoP }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(admiBancoPService.update).toHaveBeenCalledWith(admiBancoP);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdmiBancoP>>();
      const admiBancoP = new AdmiBancoP();
      jest.spyOn(admiBancoPService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ admiBancoP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: admiBancoP }));
      saveSubject.complete();

      // THEN
      expect(admiBancoPService.create).toHaveBeenCalledWith(admiBancoP);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AdmiBancoP>>();
      const admiBancoP = { id: 123 };
      jest.spyOn(admiBancoPService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ admiBancoP });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(admiBancoPService.update).toHaveBeenCalledWith(admiBancoP);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
