import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocenteMateria, getDocenteMateriaIdentifier } from '../docente-materia.model';

export type EntityResponseType = HttpResponse<IDocenteMateria>;
export type EntityArrayResponseType = HttpResponse<IDocenteMateria[]>;

@Injectable({ providedIn: 'root' })
export class DocenteMateriaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/docente-materias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(docenteMateria: IDocenteMateria): Observable<EntityResponseType> {
    return this.http.post<IDocenteMateria>(this.resourceUrl, docenteMateria, { observe: 'response' });
  }

  update(docenteMateria: IDocenteMateria): Observable<EntityResponseType> {
    return this.http.put<IDocenteMateria>(`${this.resourceUrl}/${getDocenteMateriaIdentifier(docenteMateria) as number}`, docenteMateria, {
      observe: 'response',
    });
  }

  partialUpdate(docenteMateria: IDocenteMateria): Observable<EntityResponseType> {
    return this.http.patch<IDocenteMateria>(
      `${this.resourceUrl}/${getDocenteMateriaIdentifier(docenteMateria) as number}`,
      docenteMateria,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDocenteMateria>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocenteMateria[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDocenteMateriaToCollectionIfMissing(
    docenteMateriaCollection: IDocenteMateria[],
    ...docenteMateriasToCheck: (IDocenteMateria | null | undefined)[]
  ): IDocenteMateria[] {
    const docenteMaterias: IDocenteMateria[] = docenteMateriasToCheck.filter(isPresent);
    if (docenteMaterias.length > 0) {
      const docenteMateriaCollectionIdentifiers = docenteMateriaCollection.map(
        docenteMateriaItem => getDocenteMateriaIdentifier(docenteMateriaItem)!
      );
      const docenteMateriasToAdd = docenteMaterias.filter(docenteMateriaItem => {
        const docenteMateriaIdentifier = getDocenteMateriaIdentifier(docenteMateriaItem);
        if (docenteMateriaIdentifier == null || docenteMateriaCollectionIdentifiers.includes(docenteMateriaIdentifier)) {
          return false;
        }
        docenteMateriaCollectionIdentifiers.push(docenteMateriaIdentifier);
        return true;
      });
      return [...docenteMateriasToAdd, ...docenteMateriaCollection];
    }
    return docenteMateriaCollection;
  }
}
