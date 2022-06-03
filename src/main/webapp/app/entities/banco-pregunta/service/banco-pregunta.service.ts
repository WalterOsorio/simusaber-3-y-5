import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBancoPregunta, getBancoPreguntaIdentifier } from '../banco-pregunta.model';

export type EntityResponseType = HttpResponse<IBancoPregunta>;
export type EntityArrayResponseType = HttpResponse<IBancoPregunta[]>;

@Injectable({ providedIn: 'root' })
export class BancoPreguntaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/banco-preguntas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bancoPregunta: IBancoPregunta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bancoPregunta);
    return this.http
      .post<IBancoPregunta>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bancoPregunta: IBancoPregunta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bancoPregunta);
    return this.http
      .put<IBancoPregunta>(`${this.resourceUrl}/${getBancoPreguntaIdentifier(bancoPregunta) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(bancoPregunta: IBancoPregunta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bancoPregunta);
    return this.http
      .patch<IBancoPregunta>(`${this.resourceUrl}/${getBancoPreguntaIdentifier(bancoPregunta) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBancoPregunta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBancoPregunta[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBancoPreguntaToCollectionIfMissing(
    bancoPreguntaCollection: IBancoPregunta[],
    ...bancoPreguntasToCheck: (IBancoPregunta | null | undefined)[]
  ): IBancoPregunta[] {
    const bancoPreguntas: IBancoPregunta[] = bancoPreguntasToCheck.filter(isPresent);
    if (bancoPreguntas.length > 0) {
      const bancoPreguntaCollectionIdentifiers = bancoPreguntaCollection.map(
        bancoPreguntaItem => getBancoPreguntaIdentifier(bancoPreguntaItem)!
      );
      const bancoPreguntasToAdd = bancoPreguntas.filter(bancoPreguntaItem => {
        const bancoPreguntaIdentifier = getBancoPreguntaIdentifier(bancoPreguntaItem);
        if (bancoPreguntaIdentifier == null || bancoPreguntaCollectionIdentifiers.includes(bancoPreguntaIdentifier)) {
          return false;
        }
        bancoPreguntaCollectionIdentifiers.push(bancoPreguntaIdentifier);
        return true;
      });
      return [...bancoPreguntasToAdd, ...bancoPreguntaCollection];
    }
    return bancoPreguntaCollection;
  }

  protected convertDateFromClient(bancoPregunta: IBancoPregunta): IBancoPregunta {
    return Object.assign({}, bancoPregunta, {
      fechaActualizacion: bancoPregunta.fechaActualizacion?.isValid() ? bancoPregunta.fechaActualizacion.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaActualizacion = res.body.fechaActualizacion ? dayjs(res.body.fechaActualizacion) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bancoPregunta: IBancoPregunta) => {
        bancoPregunta.fechaActualizacion = bancoPregunta.fechaActualizacion ? dayjs(bancoPregunta.fechaActualizacion) : undefined;
      });
    }
    return res;
  }
}
