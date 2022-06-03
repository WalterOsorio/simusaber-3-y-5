import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { State } from 'app/entities/enumerations/state.model';
import { ITipoDocumento, TipoDocumento } from '../tipo-documento.model';

import { TipoDocumentoService } from './tipo-documento.service';

describe('TipoDocumento Service', () => {
  let service: TipoDocumentoService;
  let httpMock: HttpTestingController;
  let elemDefault: ITipoDocumento;
  let expectedResult: ITipoDocumento | ITipoDocumento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TipoDocumentoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      iniciales: 'AAAAAAA',
      nombreDocumento: 'AAAAAAA',
      estadoTipoDocumento: State.Active,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TipoDocumento', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TipoDocumento()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TipoDocumento', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          iniciales: 'BBBBBB',
          nombreDocumento: 'BBBBBB',
          estadoTipoDocumento: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TipoDocumento', () => {
      const patchObject = Object.assign(
        {
          iniciales: 'BBBBBB',
          estadoTipoDocumento: 'BBBBBB',
        },
        new TipoDocumento()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TipoDocumento', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          iniciales: 'BBBBBB',
          nombreDocumento: 'BBBBBB',
          estadoTipoDocumento: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a TipoDocumento', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTipoDocumentoToCollectionIfMissing', () => {
      it('should add a TipoDocumento to an empty array', () => {
        const tipoDocumento: ITipoDocumento = { id: 123 };
        expectedResult = service.addTipoDocumentoToCollectionIfMissing([], tipoDocumento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoDocumento);
      });

      it('should not add a TipoDocumento to an array that contains it', () => {
        const tipoDocumento: ITipoDocumento = { id: 123 };
        const tipoDocumentoCollection: ITipoDocumento[] = [
          {
            ...tipoDocumento,
          },
          { id: 456 },
        ];
        expectedResult = service.addTipoDocumentoToCollectionIfMissing(tipoDocumentoCollection, tipoDocumento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TipoDocumento to an array that doesn't contain it", () => {
        const tipoDocumento: ITipoDocumento = { id: 123 };
        const tipoDocumentoCollection: ITipoDocumento[] = [{ id: 456 }];
        expectedResult = service.addTipoDocumentoToCollectionIfMissing(tipoDocumentoCollection, tipoDocumento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoDocumento);
      });

      it('should add only unique TipoDocumento to an array', () => {
        const tipoDocumentoArray: ITipoDocumento[] = [{ id: 123 }, { id: 456 }, { id: 89859 }];
        const tipoDocumentoCollection: ITipoDocumento[] = [{ id: 123 }];
        expectedResult = service.addTipoDocumentoToCollectionIfMissing(tipoDocumentoCollection, ...tipoDocumentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tipoDocumento: ITipoDocumento = { id: 123 };
        const tipoDocumento2: ITipoDocumento = { id: 456 };
        expectedResult = service.addTipoDocumentoToCollectionIfMissing([], tipoDocumento, tipoDocumento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoDocumento);
        expect(expectedResult).toContain(tipoDocumento2);
      });

      it('should accept null and undefined values', () => {
        const tipoDocumento: ITipoDocumento = { id: 123 };
        expectedResult = service.addTipoDocumentoToCollectionIfMissing([], null, tipoDocumento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoDocumento);
      });

      it('should return initial array if no TipoDocumento is added', () => {
        const tipoDocumentoCollection: ITipoDocumento[] = [{ id: 123 }];
        expectedResult = service.addTipoDocumentoToCollectionIfMissing(tipoDocumentoCollection, undefined, null);
        expect(expectedResult).toEqual(tipoDocumentoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
