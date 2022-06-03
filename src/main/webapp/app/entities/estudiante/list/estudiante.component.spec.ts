import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EstudianteService } from '../service/estudiante.service';

import { EstudianteComponent } from './estudiante.component';

describe('Estudiante Management Component', () => {
  let comp: EstudianteComponent;
  let fixture: ComponentFixture<EstudianteComponent>;
  let service: EstudianteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EstudianteComponent],
    })
      .overrideTemplate(EstudianteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EstudianteService);

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
    expect(comp.estudiantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
