import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SalaMateriaService } from '../service/sala-materia.service';

import { SalaMateriaComponent } from './sala-materia.component';

describe('SalaMateria Management Component', () => {
  let comp: SalaMateriaComponent;
  let fixture: ComponentFixture<SalaMateriaComponent>;
  let service: SalaMateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SalaMateriaComponent],
    })
      .overrideTemplate(SalaMateriaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalaMateriaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SalaMateriaService);

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
    expect(comp.salaMaterias?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
