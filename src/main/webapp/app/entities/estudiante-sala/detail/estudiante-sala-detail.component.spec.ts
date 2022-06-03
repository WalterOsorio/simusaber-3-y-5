import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EstudianteSalaDetailComponent } from './estudiante-sala-detail.component';

describe('EstudianteSala Management Detail Component', () => {
  let comp: EstudianteSalaDetailComponent;
  let fixture: ComponentFixture<EstudianteSalaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstudianteSalaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ estudianteSala: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EstudianteSalaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EstudianteSalaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load estudianteSala on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.estudianteSala).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
