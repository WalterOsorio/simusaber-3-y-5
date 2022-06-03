import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DocenteService } from '../service/docente.service';

import { DocenteComponent } from './docente.component';

describe('Docente Management Component', () => {
  let comp: DocenteComponent;
  let fixture: ComponentFixture<DocenteComponent>;
  let service: DocenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocenteComponent],
    })
      .overrideTemplate(DocenteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocenteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DocenteService);

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
    expect(comp.docentes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
