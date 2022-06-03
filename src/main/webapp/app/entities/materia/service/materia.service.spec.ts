import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMateria, Materia } from '../materia.model';

import { MateriaService } from './materia.service';

describe('Materia Service', () => {
  let service: MateriaService;
  let httpMock: HttpTestingController;
  let elemDefault: IMateria;
  let expectedResult: IMateria | IMateria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MateriaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombreMateria: 'AAAAAAA',
      numeroPreguntas: 0,
      pregunta: 'AAAAAAA',
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

    it('should create a Materia', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Materia()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Materia', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreMateria: 'BBBBBB',
          numeroPreguntas: 1,
          pregunta: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Materia', () => {
      const patchObject = Object.assign(
        {
          nombreMateria: 'BBBBBB',
        },
        new Materia()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Materia', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreMateria: 'BBBBBB',
          numeroPreguntas: 1,
          pregunta: 'BBBBBB',
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

    it('should delete a Materia', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMateriaToCollectionIfMissing', () => {
      it('should add a Materia to an empty array', () => {
        const materia: IMateria = { id: 123 };
        expectedResult = service.addMateriaToCollectionIfMissing([], materia);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(materia);
      });

      it('should not add a Materia to an array that contains it', () => {
        const materia: IMateria = { id: 123 };
        const materiaCollection: IMateria[] = [
          {
            ...materia,
          },
          { id: 456 },
        ];
        expectedResult = service.addMateriaToCollectionIfMissing(materiaCollection, materia);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Materia to an array that doesn't contain it", () => {
        const materia: IMateria = { id: 123 };
        const materiaCollection: IMateria[] = [{ id: 456 }];
        expectedResult = service.addMateriaToCollectionIfMissing(materiaCollection, materia);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(materia);
      });

      it('should add only unique Materia to an array', () => {
        const materiaArray: IMateria[] = [{ id: 123 }, { id: 456 }, { id: 33628 }];
        const materiaCollection: IMateria[] = [{ id: 123 }];
        expectedResult = service.addMateriaToCollectionIfMissing(materiaCollection, ...materiaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const materia: IMateria = { id: 123 };
        const materia2: IMateria = { id: 456 };
        expectedResult = service.addMateriaToCollectionIfMissing([], materia, materia2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(materia);
        expect(expectedResult).toContain(materia2);
      });

      it('should accept null and undefined values', () => {
        const materia: IMateria = { id: 123 };
        expectedResult = service.addMateriaToCollectionIfMissing([], null, materia, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(materia);
      });

      it('should return initial array if no Materia is added', () => {
        const materiaCollection: IMateria[] = [{ id: 123 }];
        expectedResult = service.addMateriaToCollectionIfMissing(materiaCollection, undefined, null);
        expect(expectedResult).toEqual(materiaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
