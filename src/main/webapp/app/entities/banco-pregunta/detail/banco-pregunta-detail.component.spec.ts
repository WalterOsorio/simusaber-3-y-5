import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BancoPreguntaDetailComponent } from './banco-pregunta-detail.component';

describe('BancoPregunta Management Detail Component', () => {
  let comp: BancoPreguntaDetailComponent;
  let fixture: ComponentFixture<BancoPreguntaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BancoPreguntaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bancoPregunta: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BancoPreguntaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BancoPreguntaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bancoPregunta on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bancoPregunta).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
