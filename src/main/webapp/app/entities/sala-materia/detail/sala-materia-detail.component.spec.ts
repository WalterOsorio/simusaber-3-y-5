import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalaMateriaDetailComponent } from './sala-materia-detail.component';

describe('SalaMateria Management Detail Component', () => {
  let comp: SalaMateriaDetailComponent;
  let fixture: ComponentFixture<SalaMateriaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaMateriaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ salaMateria: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SalaMateriaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SalaMateriaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load salaMateria on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.salaMateria).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
