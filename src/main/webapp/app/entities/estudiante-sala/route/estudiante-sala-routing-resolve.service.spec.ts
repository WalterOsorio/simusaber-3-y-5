import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEstudianteSala, EstudianteSala } from '../estudiante-sala.model';
import { EstudianteSalaService } from '../service/estudiante-sala.service';

import { EstudianteSalaRoutingResolveService } from './estudiante-sala-routing-resolve.service';

describe('EstudianteSala routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EstudianteSalaRoutingResolveService;
  let service: EstudianteSalaService;
  let resultEstudianteSala: IEstudianteSala | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(EstudianteSalaRoutingResolveService);
    service = TestBed.inject(EstudianteSalaService);
    resultEstudianteSala = undefined;
  });

  describe('resolve', () => {
    it('should return IEstudianteSala returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEstudianteSala = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEstudianteSala).toEqual({ id: 123 });
    });

    it('should return new IEstudianteSala if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEstudianteSala = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEstudianteSala).toEqual(new EstudianteSala());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EstudianteSala })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEstudianteSala = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEstudianteSala).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
