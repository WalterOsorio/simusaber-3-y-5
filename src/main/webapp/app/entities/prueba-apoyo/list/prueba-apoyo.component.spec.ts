import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PruebaApoyoService } from '../service/prueba-apoyo.service';

import { PruebaApoyoComponent } from './prueba-apoyo.component';

describe('PruebaApoyo Management Component', () => {
  let comp: PruebaApoyoComponent;
  let fixture: ComponentFixture<PruebaApoyoComponent>;
  let service: PruebaApoyoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PruebaApoyoComponent],
    })
      .overrideTemplate(PruebaApoyoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PruebaApoyoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PruebaApoyoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.pruebaApoyos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
