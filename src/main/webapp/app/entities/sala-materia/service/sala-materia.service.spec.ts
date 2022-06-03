import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISalaMateria, SalaMateria } from '../sala-materia.model';

import { SalaMateriaService } from './sala-materia.service';

describe('SalaMateria Service', () => {
  let service: SalaMateriaService;
  let httpMock: HttpTestingController;
  let elemDefault: ISalaMateria;
  let expectedResult: ISalaMateria | ISalaMateria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SalaMateriaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      idSala: 0,
      idMateria: 0,
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

    it('should create a SalaMateria', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SalaMateria()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SalaMateria', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idSala: 1,
          idMateria: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SalaMateria', () => {
      const patchObject = Object.assign({}, new SalaMateria());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SalaMateria', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idSala: 1,
          idMateria: 1,
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

    it('should delete a SalaMateria', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSalaMateriaToCollectionIfMissing', () => {
      it('should add a SalaMateria to an empty array', () => {
        const salaMateria: ISalaMateria = { id: 123 };
        expectedResult = service.addSalaMateriaToCollectionIfMissing([], salaMateria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(salaMateria);
      });

      it('should not add a SalaMateria to an array that contains it', () => {
        const salaMateria: ISalaMateria = { id: 123 };
        const salaMateriaCollection: ISalaMateria[] = [
          {
            ...salaMateria,
          },
          { id: 456 },
        ];
        expectedResult = service.addSalaMateriaToCollectionIfMissing(salaMateriaCollection, salaMateria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SalaMateria to an array that doesn't contain it", () => {
        const salaMateria: ISalaMateria = { id: 123 };
        const salaMateriaCollection: ISalaMateria[] = [{ id: 456 }];
        expectedResult = service.addSalaMateriaToCollectionIfMissing(salaMateriaCollection, salaMateria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(salaMateria);
      });

      it('should add only unique SalaMateria to an array', () => {
        const salaMateriaArray: ISalaMateria[] = [{ id: 123 }, { id: 456 }, { id: 71093 }];
        const salaMateriaCollection: ISalaMateria[] = [{ id: 123 }];
        expectedResult = service.addSalaMateriaToCollectionIfMissing(salaMateriaCollection, ...salaMateriaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const salaMateria: ISalaMateria = { id: 123 };
        const salaMateria2: ISalaMateria = { id: 456 };
        expectedResult = service.addSalaMateriaToCollectionIfMissing([], salaMateria, salaMateria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(salaMateria);
        expect(expectedResult).toContain(salaMateria2);
      });

      it('should accept null and undefined values', () => {
        const salaMateria: ISalaMateria = { id: 123 };
        expectedResult = service.addSalaMateriaToCollectionIfMissing([], null, salaMateria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(salaMateria);
      });

      it('should return initial array if no SalaMateria is added', () => {
        const salaMateriaCollection: ISalaMateria[] = [{ id: 123 }];
        expectedResult = service.addSalaMateriaToCollectionIfMissing(salaMateriaCollection, undefined, null);
        expect(expectedResult).toEqual(salaMateriaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
