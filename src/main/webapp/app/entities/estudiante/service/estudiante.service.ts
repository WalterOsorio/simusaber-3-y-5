import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstudiante, getEstudianteIdentifier } from '../estudiante.model';

export type EntityResponseType = HttpResponse<IEstudiante>;
export type EntityArrayResponseType = HttpResponse<IEstudiante[]>;

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estudiantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(estudiante: IEstudiante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estudiante);
    return this.http
      .post<IEstudiante>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(estudiante: IEstudiante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estudiante);
    return this.http
      .put<IEstudiante>(`${this.resourceUrl}/${getEstudianteIdentifier(estudiante) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(estudiante: IEstudiante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estudiante);
    return this.http
      .patch<IEstudiante>(`${this.resourceUrl}/${getEstudianteIdentifier(estudiante) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEstudiante>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEstudiante[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEstudianteToCollectionIfMissing(
    estudianteCollection: IEstudiante[],
    ...estudiantesToCheck: (IEstudiante | null | undefined)[]
  ): IEstudiante[] {
    const estudiantes: IEstudiante[] = estudiantesToCheck.filter(isPresent);
    if (estudiantes.length > 0) {
      const estudianteCollectionIdentifiers = estudianteCollection.map(estudianteItem => getEstudianteIdentifier(estudianteItem)!);
      const estudiantesToAdd = estudiantes.filter(estudianteItem => {
        const estudianteIdentifier = getEstudianteIdentifier(estudianteItem);
        if (estudianteIdentifier == null || estudianteCollectionIdentifiers.includes(estudianteIdentifier)) {
          return false;
        }
        estudianteCollectionIdentifiers.push(estudianteIdentifier);
        return true;
      });
      return [...estudiantesToAdd, ...estudianteCollection];
    }
    return estudianteCollection;
  }

  protected convertDateFromClient(estudiante: IEstudiante): IEstudiante {
    return Object.assign({}, estudiante, {
      fechaNacimiento: estudiante.fechaNacimiento?.isValid() ? estudiante.fechaNacimiento.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaNacimiento = res.body.fechaNacimiento ? dayjs(res.body.fechaNacimiento) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((estudiante: IEstudiante) => {
        estudiante.fechaNacimiento = estudiante.fechaNacimiento ? dayjs(estudiante.fechaNacimiento) : undefined;
      });
    }
    return res;
  }
}
