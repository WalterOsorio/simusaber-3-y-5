import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAdmiBancoP, AdmiBancoP } from '../admi-banco-p.model';
import { AdmiBancoPService } from '../service/admi-banco-p.service';

import { AdmiBancoPRoutingResolveService } from './admi-banco-p-routing-resolve.service';

describe('AdmiBancoP routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AdmiBancoPRoutingResolveService;
  let service: AdmiBancoPService;
  let resultAdmiBancoP: IAdmiBancoP | undefined;

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
    routingResolveService = TestBed.inject(AdmiBancoPRoutingResolveService);
    service = TestBed.inject(AdmiBancoPService);
    resultAdmiBancoP = undefined;
  });

  describe('resolve', () => {
    it('should return IAdmiBancoP returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdmiBancoP = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAdmiBancoP).toEqual({ id: 123 });
    });

    it('should return new IAdmiBancoP if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdmiBancoP = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAdmiBancoP).toEqual(new AdmiBancoP());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AdmiBancoP })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAdmiBancoP = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAdmiBancoP).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
