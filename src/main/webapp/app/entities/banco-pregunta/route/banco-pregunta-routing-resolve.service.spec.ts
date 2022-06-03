import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBancoPregunta, BancoPregunta } from '../banco-pregunta.model';
import { BancoPreguntaService } from '../service/banco-pregunta.service';

import { BancoPreguntaRoutingResolveService } from './banco-pregunta-routing-resolve.service';

describe('BancoPregunta routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BancoPreguntaRoutingResolveService;
  let service: BancoPreguntaService;
  let resultBancoPregunta: IBancoPregunta | undefined;

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
    routingResolveService = TestBed.inject(BancoPreguntaRoutingResolveService);
    service = TestBed.inject(BancoPreguntaService);
    resultBancoPregunta = undefined;
  });

  describe('resolve', () => {
    it('should return IBancoPregunta returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBancoPregunta = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBancoPregunta).toEqual({ id: 123 });
    });

    it('should return new IBancoPregunta if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBancoPregunta = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBancoPregunta).toEqual(new BancoPregunta());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BancoPregunta })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBancoPregunta = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBancoPregunta).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
