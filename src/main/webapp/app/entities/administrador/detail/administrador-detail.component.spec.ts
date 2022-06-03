import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdministradorDetailComponent } from './administrador-detail.component';

describe('Administrador Management Detail Component', () => {
  let comp: AdministradorDetailComponent;
  let fixture: ComponentFixture<AdministradorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministradorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ administrador: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdministradorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdministradorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load administrador on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.administrador).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
