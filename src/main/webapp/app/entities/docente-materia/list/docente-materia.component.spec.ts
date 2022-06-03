import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DocenteMateriaService } from '../service/docente-materia.service';

import { DocenteMateriaComponent } from './docente-materia.component';

describe('DocenteMateria Management Component', () => {
  let comp: DocenteMateriaComponent;
  let fixture: ComponentFixture<DocenteMateriaComponent>;
  let service: DocenteMateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocenteMateriaComponent],
    })
      .overrideTemplate(DocenteMateriaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocenteMateriaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DocenteMateriaService);

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
    expect(comp.docenteMaterias?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
