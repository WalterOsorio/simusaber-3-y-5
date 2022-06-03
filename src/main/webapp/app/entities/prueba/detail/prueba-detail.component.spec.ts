import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PruebaDetailComponent } from './prueba-detail.component';

describe('Prueba Management Detail Component', () => {
  let comp: PruebaDetailComponent;
  let fixture: ComponentFixture<PruebaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PruebaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ prueba: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PruebaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PruebaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load prueba on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.prueba).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
