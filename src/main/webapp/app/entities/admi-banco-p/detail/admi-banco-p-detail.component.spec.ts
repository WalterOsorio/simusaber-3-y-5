import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdmiBancoPDetailComponent } from './admi-banco-p-detail.component';

describe('AdmiBancoP Management Detail Component', () => {
  let comp: AdmiBancoPDetailComponent;
  let fixture: ComponentFixture<AdmiBancoPDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmiBancoPDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ admiBancoP: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdmiBancoPDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdmiBancoPDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load admiBancoP on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.admiBancoP).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
