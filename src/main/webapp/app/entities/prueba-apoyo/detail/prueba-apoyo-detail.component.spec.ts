import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PruebaApoyoDetailComponent } from './prueba-apoyo-detail.component';

describe('PruebaApoyo Management Detail Component', () => {
  let comp: PruebaApoyoDetailComponent;
  let fixture: ComponentFixture<PruebaApoyoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PruebaApoyoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pruebaApoyo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PruebaApoyoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PruebaApoyoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pruebaApoyo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pruebaApoyo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
