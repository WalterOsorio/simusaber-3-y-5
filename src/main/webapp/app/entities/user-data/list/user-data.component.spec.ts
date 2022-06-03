import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserDataService } from '../service/user-data.service';

import { UserDataComponent } from './user-data.component';

describe('UserData Management Component', () => {
  let comp: UserDataComponent;
  let fixture: ComponentFixture<UserDataComponent>;
  let service: UserDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserDataComponent],
    })
      .overrideTemplate(UserDataComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDataComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserDataService);

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
    expect(comp.userData?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
