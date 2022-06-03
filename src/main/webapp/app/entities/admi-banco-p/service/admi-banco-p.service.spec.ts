import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAdmiBancoP, AdmiBancoP } from '../admi-banco-p.model';

import { AdmiBancoPService } from './admi-banco-p.service';

describe('AdmiBancoP Service', () => {
  let service: AdmiBancoPService;
  let httpMock: HttpTestingController;
  let elemDefault: IAdmiBancoP;
  let expectedResult: IAdmiBancoP | IAdmiBancoP[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AdmiBancoPService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      idAdministrador: 0,
      idBancoPregunta: 0,
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

    it('should create a AdmiBancoP', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AdmiBancoP()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AdmiBancoP', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idAdministrador: 1,
          idBancoPregunta: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AdmiBancoP', () => {
      const patchObject = Object.assign(
        {
          idAdministrador: 1,
        },
        new AdmiBancoP()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AdmiBancoP', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          idAdministrador: 1,
          idBancoPregunta: 1,
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

    it('should delete a AdmiBancoP', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAdmiBancoPToCollectionIfMissing', () => {
      it('should add a AdmiBancoP to an empty array', () => {
        const admiBancoP: IAdmiBancoP = { id: 123 };
        expectedResult = service.addAdmiBancoPToCollectionIfMissing([], admiBancoP);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(admiBancoP);
      });

      it('should not add a AdmiBancoP to an array that contains it', () => {
        const admiBancoP: IAdmiBancoP = { id: 123 };
        const admiBancoPCollection: IAdmiBancoP[] = [
          {
            ...admiBancoP,
          },
          { id: 456 },
        ];
        expectedResult = service.addAdmiBancoPToCollectionIfMissing(admiBancoPCollection, admiBancoP);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AdmiBancoP to an array that doesn't contain it", () => {
        const admiBancoP: IAdmiBancoP = { id: 123 };
        const admiBancoPCollection: IAdmiBancoP[] = [{ id: 456 }];
        expectedResult = service.addAdmiBancoPToCollectionIfMissing(admiBancoPCollection, admiBancoP);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(admiBancoP);
      });

      it('should add only unique AdmiBancoP to an array', () => {
        const admiBancoPArray: IAdmiBancoP[] = [{ id: 123 }, { id: 456 }, { id: 43490 }];
        const admiBancoPCollection: IAdmiBancoP[] = [{ id: 123 }];
        expectedResult = service.addAdmiBancoPToCollectionIfMissing(admiBancoPCollection, ...admiBancoPArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const admiBancoP: IAdmiBancoP = { id: 123 };
        const admiBancoP2: IAdmiBancoP = { id: 456 };
        expectedResult = service.addAdmiBancoPToCollectionIfMissing([], admiBancoP, admiBancoP2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(admiBancoP);
        expect(expectedResult).toContain(admiBancoP2);
      });

      it('should accept null and undefined values', () => {
        const admiBancoP: IAdmiBancoP = { id: 123 };
        expectedResult = service.addAdmiBancoPToCollectionIfMissing([], null, admiBancoP, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(admiBancoP);
      });

      it('should return initial array if no AdmiBancoP is added', () => {
        const admiBancoPCollection: IAdmiBancoP[] = [{ id: 123 }];
        expectedResult = service.addAdmiBancoPToCollectionIfMissing(admiBancoPCollection, undefined, null);
        expect(expectedResult).toEqual(admiBancoPCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
