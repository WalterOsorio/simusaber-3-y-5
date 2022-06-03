import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPrueba, Prueba } from '../prueba.model';

import { PruebaService } from './prueba.service';

describe('Prueba Service', () => {
  let service: PruebaService;
  let httpMock: HttpTestingController;
  let elemDefault: IPrueba;
  let expectedResult: IPrueba | IPrueba[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PruebaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fechaAplicacion: currentDate,
      resultado: 0,
      retroalimentacion: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fechaAplicacion: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Prueba', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fechaAplicacion: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaAplicacion: currentDate,
        },
        returnedFromService
      );

      service.create(new Prueba()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Prueba', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fechaAplicacion: currentDate.format(DATE_FORMAT),
          resultado: 1,
          retroalimentacion: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaAplicacion: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Prueba', () => {
      const patchObject = Object.assign(
        {
          fechaAplicacion: currentDate.format(DATE_FORMAT),
          retroalimentacion: 'BBBBBB',
        },
        new Prueba()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fechaAplicacion: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Prueba', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fechaAplicacion: currentDate.format(DATE_FORMAT),
          resultado: 1,
          retroalimentacion: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaAplicacion: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Prueba', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPruebaToCollectionIfMissing', () => {
      it('should add a Prueba to an empty array', () => {
        const prueba: IPrueba = { id: 123 };
        expectedResult = service.addPruebaToCollectionIfMissing([], prueba);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prueba);
      });

      it('should not add a Prueba to an array that contains it', () => {
        const prueba: IPrueba = { id: 123 };
        const pruebaCollection: IPrueba[] = [
          {
            ...prueba,
          },
          { id: 456 },
        ];
        expectedResult = service.addPruebaToCollectionIfMissing(pruebaCollection, prueba);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Prueba to an array that doesn't contain it", () => {
        const prueba: IPrueba = { id: 123 };
        const pruebaCollection: IPrueba[] = [{ id: 456 }];
        expectedResult = service.addPruebaToCollectionIfMissing(pruebaCollection, prueba);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prueba);
      });

      it('should add only unique Prueba to an array', () => {
        const pruebaArray: IPrueba[] = [{ id: 123 }, { id: 456 }, { id: 99495 }];
        const pruebaCollection: IPrueba[] = [{ id: 123 }];
        expectedResult = service.addPruebaToCollectionIfMissing(pruebaCollection, ...pruebaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const prueba: IPrueba = { id: 123 };
        const prueba2: IPrueba = { id: 456 };
        expectedResult = service.addPruebaToCollectionIfMissing([], prueba, prueba2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prueba);
        expect(expectedResult).toContain(prueba2);
      });

      it('should accept null and undefined values', () => {
        const prueba: IPrueba = { id: 123 };
        expectedResult = service.addPruebaToCollectionIfMissing([], null, prueba, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(prueba);
      });

      it('should return initial array if no Prueba is added', () => {
        const pruebaCollection: IPrueba[] = [{ id: 123 }];
        expectedResult = service.addPruebaToCollectionIfMissing(pruebaCollection, undefined, null);
        expect(expectedResult).toEqual(pruebaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
