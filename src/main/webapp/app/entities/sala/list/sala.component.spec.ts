import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SalaService } from '../service/sala.service';

import { SalaComponent } from './sala.component';

describe('Sala Management Component', () => {
  let comp: SalaComponent;
  let fixture: ComponentFixture<SalaComponent>;
  let service: SalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SalaComponent],
    })
      .overrideTemplate(SalaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SalaService);

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
    expect(comp.salas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
