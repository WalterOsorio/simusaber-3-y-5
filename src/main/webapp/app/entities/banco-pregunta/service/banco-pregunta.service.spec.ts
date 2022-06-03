import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBancoPregunta, BancoPregunta } from '../banco-pregunta.model';

import { BancoPreguntaService } from './banco-pregunta.service';

describe('BancoPregunta Service', () => {
  let service: BancoPreguntaService;
  let httpMock: HttpTestingController;
  let elemDefault: IBancoPregunta;
  let expectedResult: IBancoPregunta | IBancoPregunta[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BancoPreguntaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      descripcion: 'AAAAAAA',
      fechaActualizacion: currentDate,
      materia: 'AAAAAAA',
      numeroPreguntas: 0,
      pregunta: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fechaActualizacion: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a BancoPregunta', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fechaActualizacion: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaActualizacion: currentDate,
        },
        returnedFromService
      );

      service.create(new BancoPregunta()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BancoPregunta', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          descripcion: 'BBBBBB',
          fechaActualizacion: currentDate.format(DATE_FORMAT),
          materia: 'BBBBBB',
          numeroPreguntas: 1,
          pregunta: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaActualizacion: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BancoPregunta', () => {
      const patchObject = Object.assign(
        {
          fechaActualizacion: currentDate.format(DATE_FORMAT),
        },
        new BancoPregunta()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fechaActualizacion: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BancoPregunta', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          descripcion: 'BBBBBB',
          fechaActualizacion: currentDate.format(DATE_FORMAT),
          materia: 'BBBBBB',
          numeroPreguntas: 1,
          pregunta: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaActualizacion: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a BancoPregunta', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBancoPreguntaToCollectionIfMissing', () => {
      it('should add a BancoPregunta to an empty array', () => {
        const bancoPregunta: IBancoPregunta = { id: 123 };
        expectedResult = service.addBancoPreguntaToCollectionIfMissing([], bancoPregunta);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bancoPregunta);
      });

      it('should not add a BancoPregunta to an array that contains it', () => {
        const bancoPregunta: IBancoPregunta = { id: 123 };
        const bancoPreguntaCollection: IBancoPregunta[] = [
          {
            ...bancoPregunta,
          },
          { id: 456 },
        ];
        expectedResult = service.addBancoPreguntaToCollectionIfMissing(bancoPreguntaCollection, bancoPregunta);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BancoPregunta to an array that doesn't contain it", () => {
        const bancoPregunta: IBancoPregunta = { id: 123 };
        const bancoPreguntaCollection: IBancoPregunta[] = [{ id: 456 }];
        expectedResult = service.addBancoPreguntaToCollectionIfMissing(bancoPreguntaCollection, bancoPregunta);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bancoPregunta);
      });

      it('should add only unique BancoPregunta to an array', () => {
        const bancoPreguntaArray: IBancoPregunta[] = [{ id: 123 }, { id: 456 }, { id: 31128 }];
        const bancoPreguntaCollection: IBancoPregunta[] = [{ id: 123 }];
        expectedResult = service.addBancoPreguntaToCollectionIfMissing(bancoPreguntaCollection, ...bancoPreguntaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bancoPregunta: IBancoPregunta = { id: 123 };
        const bancoPregunta2: IBancoPregunta = { id: 456 };
        expectedResult = service.addBancoPreguntaToCollectionIfMissing([], bancoPregunta, bancoPregunta2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bancoPregunta);
        expect(expectedResult).toContain(bancoPregunta2);
      });

      it('should accept null and undefined values', () => {
        const bancoPregunta: IBancoPregunta = { id: 123 };
        expectedResult = service.addBancoPreguntaToCollectionIfMissing([], null, bancoPregunta, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bancoPregunta);
      });

      it('should return initial array if no BancoPregunta is added', () => {
        const bancoPreguntaCollection: IBancoPregunta[] = [{ id: 123 }];
        expectedResult = service.addBancoPreguntaToCollectionIfMissing(bancoPreguntaCollection, undefined, null);
        expect(expectedResult).toEqual(bancoPreguntaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
