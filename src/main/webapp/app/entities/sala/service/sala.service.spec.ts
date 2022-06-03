import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { State } from 'app/entities/enumerations/state.model';
import { ISala, Sala } from '../sala.model';

import { SalaService } from './sala.service';

describe('Sala Service', () => {
  let service: SalaService;
  let httpMock: HttpTestingController;
  let elemDefault: ISala;
  let expectedResult: ISala | ISala[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SalaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      estado: State.Active,
      materia: 'AAAAAAA',
      numeroEstudiantes: 0,
      resultados: 0,
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

    it('should create a Sala', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Sala()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sala', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          estado: 'BBBBBB',
          materia: 'BBBBBB',
          numeroEstudiantes: 1,
          resultados: 1,
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

    it('should partial update a Sala', () => {
      const patchObject = Object.assign(
        {
          estado: 'BBBBBB',
          materia: 'BBBBBB',
          resultados: 1,
          retroalimentacion: 'BBBBBB',
        },
        new Sala()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Sala', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          estado: 'BBBBBB',
          materia: 'BBBBBB',
          numeroEstudiantes: 1,
          resultados: 1,
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

    it('should delete a Sala', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSalaToCollectionIfMissing', () => {
      it('should add a Sala to an empty array', () => {
        const sala: ISala = { id: 123 };
        expectedResult = service.addSalaToCollectionIfMissing([], sala);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sala);
      });

      it('should not add a Sala to an array that contains it', () => {
        const sala: ISala = { id: 123 };
        const salaCollection: ISala[] = [
          {
            ...sala,
          },
          { id: 456 },
        ];
        expectedResult = service.addSalaToCollectionIfMissing(salaCollection, sala);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sala to an array that doesn't contain it", () => {
        const sala: ISala = { id: 123 };
        const salaCollection: ISala[] = [{ id: 456 }];
        expectedResult = service.addSalaToCollectionIfMissing(salaCollection, sala);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sala);
      });

      it('should add only unique Sala to an array', () => {
        const salaArray: ISala[] = [{ id: 123 }, { id: 456 }, { id: 6399 }];
        const salaCollection: ISala[] = [{ id: 123 }];
        expectedResult = service.addSalaToCollectionIfMissing(salaCollection, ...salaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sala: ISala = { id: 123 };
        const sala2: ISala = { id: 456 };
        expectedResult = service.addSalaToCollectionIfMissing([], sala, sala2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sala);
        expect(expectedResult).toContain(sala2);
      });

      it('should accept null and undefined values', () => {
        const sala: ISala = { id: 123 };
        expectedResult = service.addSalaToCollectionIfMissing([], null, sala, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sala);
      });

      it('should return initial array if no Sala is added', () => {
        const salaCollection: ISala[] = [{ id: 123 }];
        expectedResult = service.addSalaToCollectionIfMissing(salaCollection, undefined, null);
        expect(expectedResult).toEqual(salaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
