import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DocenteDetailComponent } from './docente-detail.component';

describe('Docente Management Detail Component', () => {
  let comp: DocenteDetailComponent;
  let fixture: ComponentFixture<DocenteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ docente: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DocenteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DocenteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load docente on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.docente).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
