import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDocenteMateria, DocenteMateria } from '../docente-materia.model';
import { DocenteMateriaService } from '../service/docente-materia.service';

import { DocenteMateriaRoutingResolveService } from './docente-materia-routing-resolve.service';

describe('DocenteMateria routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DocenteMateriaRoutingResolveService;
  let service: DocenteMateriaService;
  let resultDocenteMateria: IDocenteMateria | undefined;

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
    routingResolveService = TestBed.inject(DocenteMateriaRoutingResolveService);
    service = TestBed.inject(DocenteMateriaService);
    resultDocenteMateria = undefined;
  });

  describe('resolve', () => {
    it('should return IDocenteMateria returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDocenteMateria = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDocenteMateria).toEqual({ id: 123 });
    });

    it('should return new IDocenteMateria if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDocenteMateria = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDocenteMateria).toEqual(new DocenteMateria());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as DocenteMateria })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDocenteMateria = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDocenteMateria).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
