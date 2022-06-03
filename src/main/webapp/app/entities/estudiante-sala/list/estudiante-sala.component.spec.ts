import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EstudianteSalaService } from '../service/estudiante-sala.service';

import { EstudianteSalaComponent } from './estudiante-sala.component';

describe('EstudianteSala Management Component', () => {
  let comp: EstudianteSalaComponent;
  let fixture: ComponentFixture<EstudianteSalaComponent>;
  let service: EstudianteSalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EstudianteSalaComponent],
    })
      .overrideTemplate(EstudianteSalaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstudianteSalaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EstudianteSalaService);

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
    expect(comp.estudianteSalas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
