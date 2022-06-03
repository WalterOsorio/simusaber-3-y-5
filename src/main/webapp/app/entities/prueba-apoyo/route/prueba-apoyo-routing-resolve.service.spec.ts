import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPruebaApoyo, PruebaApoyo } from '../prueba-apoyo.model';
import { PruebaApoyoService } from '../service/prueba-apoyo.service';

import { PruebaApoyoRoutingResolveService } from './prueba-apoyo-routing-resolve.service';

describe('PruebaApoyo routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PruebaApoyoRoutingResolveService;
  let service: PruebaApoyoService;
  let resultPruebaApoyo: IPruebaApoyo | undefined;

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
    routingResolveService = TestBed.inject(PruebaApoyoRoutingResolveService);
    service = TestBed.inject(PruebaApoyoService);
    resultPruebaApoyo = undefined;
  });

  describe('resolve', () => {
    it('should return IPruebaApoyo returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPruebaApoyo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPruebaApoyo).toEqual({ id: 123 });
    });

    it('should return new IPruebaApoyo if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPruebaApoyo = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPruebaApoyo).toEqual(new PruebaApoyo());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PruebaApoyo })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPruebaApoyo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPruebaApoyo).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
