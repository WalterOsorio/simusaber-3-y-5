import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalaDetailComponent } from './sala-detail.component';

describe('Sala Management Detail Component', () => {
  let comp: SalaDetailComponent;
  let fixture: ComponentFixture<SalaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sala: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SalaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SalaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sala on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sala).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
