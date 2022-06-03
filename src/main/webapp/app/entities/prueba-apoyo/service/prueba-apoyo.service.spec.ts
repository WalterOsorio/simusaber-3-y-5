import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPruebaApoyo, PruebaApoyo } from '../prueba-apoyo.model';

import { PruebaApoyoService } from './prueba-apoyo.service';

describe('PruebaApoyo Service', () => {
  let service: PruebaApoyoService;
  let httpMock: HttpTestingController;
  let elemDefault: IPruebaApoyo;
  let expectedResult: IPruebaApoyo | IPruebaApoyo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PruebaApoyoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      materia: 'AAAAAAA',
      pregunta: 'AAAAAAA',
      resultado: 0,
      retroalimentacion: 'AAAAAAA',
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

    it('should create a PruebaApoyo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PruebaApoyo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PruebaApoyo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          materia: 'BBBBBB',
          pregunta: 'BBBBBB',
          resultado: 1,
          retroalimentacion: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PruebaApoyo', () => {
      const patchObject = Object.assign(
        {
          materia: 'BBBBBB',
          pregunta: 'BBBBBB',
        },
        new PruebaApoyo()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PruebaApoyo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          materia: 'BBBBBB',
          pregunta: 'BBBBBB',
          resultado: 1,
          retroalimentacion: 'BBBBBB',
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

    it('should delete a PruebaApoyo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPruebaApoyoToCollectionIfMissing', () => {
      it('should add a PruebaApoyo to an empty array', () => {
        const pruebaApoyo: IPruebaApoyo = { id: 123 };
        expectedResult = service.addPruebaApoyoToCollectionIfMissing([], pruebaApoyo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pruebaApoyo);
      });

      it('should not add a PruebaApoyo to an array that contains it', () => {
        const pruebaApoyo: IPruebaApoyo = { id: 123 };
        const pruebaApoyoCollection: IPruebaApoyo[] = [
          {
            ...pruebaApoyo,
          },
          { id: 456 },
        ];
        expectedResult = service.addPruebaApoyoToCollectionIfMissing(pruebaApoyoCollection, pruebaApoyo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PruebaApoyo to an array that doesn't contain it", () => {
        const pruebaApoyo: IPruebaApoyo = { id: 123 };
        const pruebaApoyoCollection: IPruebaApoyo[] = [{ id: 456 }];
        expectedResult = service.addPruebaApoyoToCollectionIfMissing(pruebaApoyoCollection, pruebaApoyo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pruebaApoyo);
      });

      it('should add only unique PruebaApoyo to an array', () => {
        const pruebaApoyoArray: IPruebaApoyo[] = [{ id: 123 }, { id: 456 }, { id: 50350 }];
        const pruebaApoyoCollection: IPruebaApoyo[] = [{ id: 123 }];
        expectedResult = service.addPruebaApoyoToCollectionIfMissing(pruebaApoyoCollection, ...pruebaApoyoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pruebaApoyo: IPruebaApoyo = { id: 123 };
        const pruebaApoyo2: IPruebaApoyo = { id: 456 };
        expectedResult = service.addPruebaApoyoToCollectionIfMissing([], pruebaApoyo, pruebaApoyo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pruebaApoyo);
        expect(expectedResult).toContain(pruebaApoyo2);
      });

      it('should accept null and undefined values', () => {
        const pruebaApoyo: IPruebaApoyo = { id: 123 };
        expectedResult = service.addPruebaApoyoToCollectionIfMissing([], null, pruebaApoyo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pruebaApoyo);
      });

      it('should return initial array if no PruebaApoyo is added', () => {
        const pruebaApoyoCollection: IPruebaApoyo[] = [{ id: 123 }];
        expectedResult = service.addPruebaApoyoToCollectionIfMissing(pruebaApoyoCollection, undefined, null);
        expect(expectedResult).toEqual(pruebaApoyoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
