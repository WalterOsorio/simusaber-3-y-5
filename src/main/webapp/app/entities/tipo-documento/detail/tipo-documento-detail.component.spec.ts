import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TipoDocumentoDetailComponent } from './tipo-documento-detail.component';

describe('TipoDocumento Management Detail Component', () => {
  let comp: TipoDocumentoDetailComponent;
  let fixture: ComponentFixture<TipoDocumentoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoDocumentoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tipoDocumento: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TipoDocumentoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TipoDocumentoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tipoDocumento on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tipoDocumento).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
