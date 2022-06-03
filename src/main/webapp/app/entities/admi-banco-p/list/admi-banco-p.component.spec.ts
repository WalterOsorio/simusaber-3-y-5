import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AdmiBancoPService } from '../service/admi-banco-p.service';

import { AdmiBancoPComponent } from './admi-banco-p.component';

describe('AdmiBancoP Management Component', () => {
  let comp: AdmiBancoPComponent;
  let fixture: ComponentFixture<AdmiBancoPComponent>;
  let service: AdmiBancoPService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdmiBancoPComponent],
    })
      .overrideTemplate(AdmiBancoPComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdmiBancoPComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AdmiBancoPService);

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
    expect(comp.admiBancoPS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
