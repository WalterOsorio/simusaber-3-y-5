import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEstudiante, Estudiante } from '../estudiante.model';

import { EstudianteService } from './estudiante.service';

describe('Estudiante Service', () => {
  let service: EstudianteService;
  let httpMock: HttpTestingController;
  let elemDefault: IEstudiante;
  let expectedResult: IEstudiante | IEstudiante[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EstudianteService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      grado: 'AAAAAAA',
      colegio: 'AAAAAAA',
      fechaNacimiento: currentDate,
      ciudad: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fechaNacimiento: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Estudiante', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fechaNacimiento: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaNacimiento: currentDate,
        },
        returnedFromService
      );

      service.create(new Estudiante()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estudiante', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          grado: 'BBBBBB',
          colegio: 'BBBBBB',
          fechaNacimiento: currentDate.format(DATE_FORMAT),
          ciudad: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaNacimiento: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Estudiante', () => {
      const patchObject = Object.assign(
        {
          grado: 'BBBBBB',
          colegio: 'BBBBBB',
          ciudad: 'BBBBBB',
        },
        new Estudiante()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fechaNacimiento: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estudiante', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          grado: 'BBBBBB',
          colegio: 'BBBBBB',
          fechaNacimiento: currentDate.format(DATE_FORMAT),
          ciudad: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaNacimiento: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Estudiante', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEstudianteToCollectionIfMissing', () => {
      it('should add a Estudiante to an empty array', () => {
        const estudiante: IEstudiante = { id: 123 };
        expectedResult = service.addEstudianteToCollectionIfMissing([], estudiante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudiante);
      });

      it('should not add a Estudiante to an array that contains it', () => {
        const estudiante: IEstudiante = { id: 123 };
        const estudianteCollection: IEstudiante[] = [
          {
            ...estudiante,
          },
          { id: 456 },
        ];
        expectedResult = service.addEstudianteToCollectionIfMissing(estudianteCollection, estudiante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estudiante to an array that doesn't contain it", () => {
        const estudiante: IEstudiante = { id: 123 };
        const estudianteCollection: IEstudiante[] = [{ id: 456 }];
        expectedResult = service.addEstudianteToCollectionIfMissing(estudianteCollection, estudiante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudiante);
      });

      it('should add only unique Estudiante to an array', () => {
        const estudianteArray: IEstudiante[] = [{ id: 123 }, { id: 456 }, { id: 84176 }];
        const estudianteCollection: IEstudiante[] = [{ id: 123 }];
        expectedResult = service.addEstudianteToCollectionIfMissing(estudianteCollection, ...estudianteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estudiante: IEstudiante = { id: 123 };
        const estudiante2: IEstudiante = { id: 456 };
        expectedResult = service.addEstudianteToCollectionIfMissing([], estudiante, estudiante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudiante);
        expect(expectedResult).toContain(estudiante2);
      });

      it('should accept null and undefined values', () => {
        const estudiante: IEstudiante = { id: 123 };
        expectedResult = service.addEstudianteToCollectionIfMissing([], null, estudiante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudiante);
      });

      it('should return initial array if no Estudiante is added', () => {
        const estudianteCollection: IEstudiante[] = [{ id: 123 }];
        expectedResult = service.addEstudianteToCollectionIfMissing(estudianteCollection, undefined, null);
        expect(expectedResult).toEqual(estudianteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
