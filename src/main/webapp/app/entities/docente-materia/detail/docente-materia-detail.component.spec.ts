import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DocenteMateriaDetailComponent } from './docente-materia-detail.component';

describe('DocenteMateria Management Detail Component', () => {
  let comp: DocenteMateriaDetailComponent;
  let fixture: ComponentFixture<DocenteMateriaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocenteMateriaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ docenteMateria: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DocenteMateriaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DocenteMateriaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load docenteMateria on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.docenteMateria).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
