import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BancoPreguntaService } from '../service/banco-pregunta.service';

import { BancoPreguntaComponent } from './banco-pregunta.component';

describe('BancoPregunta Management Component', () => {
  let comp: BancoPreguntaComponent;
  let fixture: ComponentFixture<BancoPreguntaComponent>;
  let service: BancoPreguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BancoPreguntaComponent],
    })
      .overrideTemplate(BancoPreguntaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BancoPreguntaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BancoPreguntaService);

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
    expect(comp.bancoPreguntas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
