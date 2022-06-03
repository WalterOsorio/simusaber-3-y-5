import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISalaMateria, getSalaMateriaIdentifier } from '../sala-materia.model';

export type EntityResponseType = HttpResponse<ISalaMateria>;
export type EntityArrayResponseType = HttpResponse<ISalaMateria[]>;

@Injectable({ providedIn: 'root' })
export class SalaMateriaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sala-materias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(salaMateria: ISalaMateria): Observable<EntityResponseType> {
    return this.http.post<ISalaMateria>(this.resourceUrl, salaMateria, { observe: 'response' });
  }

  update(salaMateria: ISalaMateria): Observable<EntityResponseType> {
    return this.http.put<ISalaMateria>(`${this.resourceUrl}/${getSalaMateriaIdentifier(salaMateria) as number}`, salaMateria, {
      observe: 'response',
    });
  }

  partialUpdate(salaMateria: ISalaMateria): Observable<EntityResponseType> {
    return this.http.patch<ISalaMateria>(`${this.resourceUrl}/${getSalaMateriaIdentifier(salaMateria) as number}`, salaMateria, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISalaMateria>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISalaMateria[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSalaMateriaToCollectionIfMissing(
    salaMateriaCollection: ISalaMateria[],
    ...salaMateriasToCheck: (ISalaMateria | null | undefined)[]
  ): ISalaMateria[] {
    const salaMaterias: ISalaMateria[] = salaMateriasToCheck.filter(isPresent);
    if (salaMaterias.length > 0) {
      const salaMateriaCollectionIdentifiers = salaMateriaCollection.map(salaMateriaItem => getSalaMateriaIdentifier(salaMateriaItem)!);
      const salaMateriasToAdd = salaMaterias.filter(salaMateriaItem => {
        const salaMateriaIdentifier = getSalaMateriaIdentifier(salaMateriaItem);
        if (salaMateriaIdentifier == null || salaMateriaCollectionIdentifiers.includes(salaMateriaIdentifier)) {
          return false;
        }
        salaMateriaCollectionIdentifiers.push(salaMateriaIdentifier);
        return true;
      });
      return [...salaMateriasToAdd, ...salaMateriaCollection];
    }
    return salaMateriaCollection;
  }
}
