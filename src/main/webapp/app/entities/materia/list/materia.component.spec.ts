import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MateriaService } from '../service/materia.service';

import { MateriaComponent } from './materia.component';

describe('Materia Management Component', () => {
  let comp: MateriaComponent;
  let fixture: ComponentFixture<MateriaComponent>;
  let service: MateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MateriaComponent],
    })
      .overrideTemplate(MateriaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MateriaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MateriaService);

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
    expect(comp.materias?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
