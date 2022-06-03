import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EstudianteDetailComponent } from './estudiante-detail.component';

describe('Estudiante Management Detail Component', () => {
  let comp: EstudianteDetailComponent;
  let fixture: ComponentFixture<EstudianteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ estudiante: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EstudianteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EstudianteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load estudiante on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.estudiante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
