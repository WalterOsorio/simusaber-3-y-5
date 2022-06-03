import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDocenteMateria, DocenteMateria } from '../docente-materia.model';

import { DocenteMateriaService } from './docente-materia.service';

describe('DocenteMateria Service', () => {
  let service: DocenteMateriaService;
  let httpMock: HttpTestingController;
  let elemDefault: IDocenteMateria;
  let expectedResult: IDocenteMateria | IDocenteMateria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DocenteMateriaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      idDocente: 0,
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

    it('should create a DocenteMateria', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new DocenteMateria()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DocenteMateria', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idDocente: 1,
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

    it('should partial update a DocenteMateria', () => {
      const patchObject = Object.assign(
        {
          idDocente: 1,
          idMateria: 1,
        },
        new DocenteMateria()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DocenteMateria', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idDocente: 1,
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

    it('should delete a DocenteMateria', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDocenteMateriaToCollectionIfMissing', () => {
      it('should add a DocenteMateria to an empty array', () => {
        const docenteMateria: IDocenteMateria = { id: 123 };
        expectedResult = service.addDocenteMateriaToCollectionIfMissing([], docenteMateria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(docenteMateria);
      });

      it('should not add a DocenteMateria to an array that contains it', () => {
        const docenteMateria: IDocenteMateria = { id: 123 };
        const docenteMateriaCollection: IDocenteMateria[] = [
          {
            ...docenteMateria,
          },
          { id: 456 },
        ];
        expectedResult = service.addDocenteMateriaToCollectionIfMissing(docenteMateriaCollection, docenteMateria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DocenteMateria to an array that doesn't contain it", () => {
        const docenteMateria: IDocenteMateria = { id: 123 };
        const docenteMateriaCollection: IDocenteMateria[] = [{ id: 456 }];
        expectedResult = service.addDocenteMateriaToCollectionIfMissing(docenteMateriaCollection, docenteMateria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(docenteMateria);
      });

      it('should add only unique DocenteMateria to an array', () => {
        const docenteMateriaArray: IDocenteMateria[] = [{ id: 123 }, { id: 456 }, { id: 6493 }];
        const docenteMateriaCollection: IDocenteMateria[] = [{ id: 123 }];
        expectedResult = service.addDocenteMateriaToCollectionIfMissing(docenteMateriaCollection, ...docenteMateriaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const docenteMateria: IDocenteMateria = { id: 123 };
        const docenteMateria2: IDocenteMateria = { id: 456 };
        expectedResult = service.addDocenteMateriaToCollectionIfMissing([], docenteMateria, docenteMateria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(docenteMateria);
        expect(expectedResult).toContain(docenteMateria2);
      });

      it('should accept null and undefined values', () => {
        const docenteMateria: IDocenteMateria = { id: 123 };
        expectedResult = service.addDocenteMateriaToCollectionIfMissing([], null, docenteMateria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(docenteMateria);
      });

      it('should return initial array if no DocenteMateria is added', () => {
        const docenteMateriaCollection: IDocenteMateria[] = [{ id: 123 }];
        expectedResult = service.addDocenteMateriaToCollectionIfMissing(docenteMateriaCollection, undefined, null);
        expect(expectedResult).toEqual(docenteMateriaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
