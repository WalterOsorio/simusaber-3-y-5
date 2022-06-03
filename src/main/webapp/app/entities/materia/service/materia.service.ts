import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMateria, getMateriaIdentifier } from '../materia.model';

export type EntityResponseType = HttpResponse<IMateria>;
export type EntityArrayResponseType = HttpResponse<IMateria[]>;

@Injectable({ providedIn: 'root' })
export class MateriaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/materias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(materia: IMateria): Observable<EntityResponseType> {
    return this.http.post<IMateria>(this.resourceUrl, materia, { observe: 'response' });
  }

  update(materia: IMateria): Observable<EntityResponseType> {
    return this.http.put<IMateria>(`${this.resourceUrl}/${getMateriaIdentifier(materia) as number}`, materia, { observe: 'response' });
  }

  partialUpdate(materia: IMateria): Observable<EntityResponseType> {
    return this.http.patch<IMateria>(`${this.resourceUrl}/${getMateriaIdentifier(materia) as number}`, materia, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMateria>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMateria[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMateriaToCollectionIfMissing(materiaCollection: IMateria[], ...materiasToCheck: (IMateria | null | undefined)[]): IMateria[] {
    const materias: IMateria[] = materiasToCheck.filter(isPresent);
    if (materias.length > 0) {
      const materiaCollectionIdentifiers = materiaCollection.map(materiaItem => getMateriaIdentifier(materiaItem)!);
      const materiasToAdd = materias.filter(materiaItem => {
        const materiaIdentifier = getMateriaIdentifier(materiaItem);
        if (materiaIdentifier == null || materiaCollectionIdentifiers.includes(materiaIdentifier)) {
          return false;
        }
        materiaCollectionIdentifiers.push(materiaIdentifier);
        return true;
      });
      return [...materiasToAdd, ...materiaCollection];
    }
    return materiaCollection;
  }
}
