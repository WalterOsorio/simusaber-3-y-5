import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PruebaService } from '../service/prueba.service';

import { PruebaComponent } from './prueba.component';

describe('Prueba Management Component', () => {
  let comp: PruebaComponent;
  let fixture: ComponentFixture<PruebaComponent>;
  let service: PruebaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PruebaComponent],
    })
      .overrideTemplate(PruebaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PruebaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PruebaService);

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
    expect(comp.pruebas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
