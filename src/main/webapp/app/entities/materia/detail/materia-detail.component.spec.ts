import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MateriaDetailComponent } from './materia-detail.component';

describe('Materia Management Detail Component', () => {
  let comp: MateriaDetailComponent;
  let fixture: ComponentFixture<MateriaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MateriaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ materia: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MateriaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MateriaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load materia on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.materia).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
