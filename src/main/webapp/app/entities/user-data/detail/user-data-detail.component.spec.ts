import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserDataDetailComponent } from './user-data-detail.component';

describe('UserData Management Detail Component', () => {
  let comp: UserDataDetailComponent;
  let fixture: ComponentFixture<UserDataDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDataDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userData: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserDataDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserDataDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userData on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userData).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
