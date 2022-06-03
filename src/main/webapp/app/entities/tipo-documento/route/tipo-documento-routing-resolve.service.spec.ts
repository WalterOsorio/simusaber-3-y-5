import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITipoDocumento, TipoDocumento } from '../tipo-documento.model';
import { TipoDocumentoService } from '../service/tipo-documento.service';

import { TipoDocumentoRoutingResolveService } from './tipo-documento-routing-resolve.service';

describe('TipoDocumento routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TipoDocumentoRoutingResolveService;
  let service: TipoDocumentoService;
  let resultTipoDocumento: ITipoDocumento | undefined;

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
    routingResolveService = TestBed.inject(TipoDocumentoRoutingResolveService);
    service = TestBed.inject(TipoDocumentoService);
    resultTipoDocumento = undefined;
  });

  describe('resolve', () => {
    it('should return ITipoDocumento returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTipoDocumento = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTipoDocumento).toEqual({ id: 123 });
    });

    it('should return new ITipoDocumento if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTipoDocumento = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTipoDocumento).toEqual(new TipoDocumento());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TipoDocumento })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTipoDocumento = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTipoDocumento).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
