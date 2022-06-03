import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPrueba, getPruebaIdentifier } from '../prueba.model';

export type EntityResponseType = HttpResponse<IPrueba>;
export type EntityArrayResponseType = HttpResponse<IPrueba[]>;

@Injectable({ providedIn: 'root' })
export class PruebaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pruebas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(prueba: IPrueba): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prueba);
    return this.http
      .post<IPrueba>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(prueba: IPrueba): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prueba);
    return this.http
      .put<IPrueba>(`${this.resourceUrl}/${getPruebaIdentifier(prueba) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(prueba: IPrueba): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(prueba);
    return this.http
      .patch<IPrueba>(`${this.resourceUrl}/${getPruebaIdentifier(prueba) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPrueba>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPrueba[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPruebaToCollectionIfMissing(pruebaCollection: IPrueba[], ...pruebasToCheck: (IPrueba | null | undefined)[]): IPrueba[] {
    const pruebas: IPrueba[] = pruebasToCheck.filter(isPresent);
    if (pruebas.length > 0) {
      const pruebaCollectionIdentifiers = pruebaCollection.map(pruebaItem => getPruebaIdentifier(pruebaItem)!);
      const pruebasToAdd = pruebas.filter(pruebaItem => {
        const pruebaIdentifier = getPruebaIdentifier(pruebaItem);
        if (pruebaIdentifier == null || pruebaCollectionIdentifiers.includes(pruebaIdentifier)) {
          return false;
        }
        pruebaCollectionIdentifiers.push(pruebaIdentifier);
        return true;
      });
      return [...pruebasToAdd, ...pruebaCollection];
    }
    return pruebaCollection;
  }

  protected convertDateFromClient(prueba: IPrueba): IPrueba {
    return Object.assign({}, prueba, {
      fechaAplicacion: prueba.fechaAplicacion?.isValid() ? prueba.fechaAplicacion.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaAplicacion = res.body.fechaAplicacion ? dayjs(res.body.fechaAplicacion) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((prueba: IPrueba) => {
        prueba.fechaAplicacion = prueba.fechaAplicacion ? dayjs(prueba.fechaAplicacion) : undefined;
      });
    }
    return res;
  }
}
