import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEstudianteSala, EstudianteSala } from '../estudiante-sala.model';

import { EstudianteSalaService } from './estudiante-sala.service';

describe('EstudianteSala Service', () => {
  let service: EstudianteSalaService;
  let httpMock: HttpTestingController;
  let elemDefault: IEstudianteSala;
  let expectedResult: IEstudianteSala | IEstudianteSala[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EstudianteSalaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      idEstudiante: 0,
      idSala: 0,
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

    it('should create a EstudianteSala', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EstudianteSala()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EstudianteSala', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idEstudiante: 1,
          idSala: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EstudianteSala', () => {
      const patchObject = Object.assign(
        {
          idEstudiante: 1,
          idSala: 1,
        },
        new EstudianteSala()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EstudianteSala', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idEstudiante: 1,
          idSala: 1,
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

    it('should delete a EstudianteSala', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEstudianteSalaToCollectionIfMissing', () => {
      it('should add a EstudianteSala to an empty array', () => {
        const estudianteSala: IEstudianteSala = { id: 123 };
        expectedResult = service.addEstudianteSalaToCollectionIfMissing([], estudianteSala);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudianteSala);
      });

      it('should not add a EstudianteSala to an array that contains it', () => {
        const estudianteSala: IEstudianteSala = { id: 123 };
        const estudianteSalaCollection: IEstudianteSala[] = [
          {
            ...estudianteSala,
          },
          { id: 456 },
        ];
        expectedResult = service.addEstudianteSalaToCollectionIfMissing(estudianteSalaCollection, estudianteSala);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EstudianteSala to an array that doesn't contain it", () => {
        const estudianteSala: IEstudianteSala = { id: 123 };
        const estudianteSalaCollection: IEstudianteSala[] = [{ id: 456 }];
        expectedResult = service.addEstudianteSalaToCollectionIfMissing(estudianteSalaCollection, estudianteSala);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudianteSala);
      });

      it('should add only unique EstudianteSala to an array', () => {
        const estudianteSalaArray: IEstudianteSala[] = [{ id: 123 }, { id: 456 }, { id: 97292 }];
        const estudianteSalaCollection: IEstudianteSala[] = [{ id: 123 }];
        expectedResult = service.addEstudianteSalaToCollectionIfMissing(estudianteSalaCollection, ...estudianteSalaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estudianteSala: IEstudianteSala = { id: 123 };
        const estudianteSala2: IEstudianteSala = { id: 456 };
        expectedResult = service.addEstudianteSalaToCollectionIfMissing([], estudianteSala, estudianteSala2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudianteSala);
        expect(expectedResult).toContain(estudianteSala2);
      });

      it('should accept null and undefined values', () => {
        const estudianteSala: IEstudianteSala = { id: 123 };
        expectedResult = service.addEstudianteSalaToCollectionIfMissing([], null, estudianteSala, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudianteSala);
      });

      it('should return initial array if no EstudianteSala is added', () => {
        const estudianteSalaCollection: IEstudianteSala[] = [{ id: 123 }];
        expectedResult = service.addEstudianteSalaToCollectionIfMissing(estudianteSalaCollection, undefined, null);
        expect(expectedResult).toEqual(estudianteSalaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
