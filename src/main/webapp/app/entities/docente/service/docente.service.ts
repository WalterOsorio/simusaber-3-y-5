import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocente, getDocenteIdentifier } from '../docente.model';

export type EntityResponseType = HttpResponse<IDocente>;
export type EntityArrayResponseType = HttpResponse<IDocente[]>;

@Injectable({ providedIn: 'root' })
export class DocenteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/docentes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(docente: IDocente): Observable<EntityResponseType> {
    return this.http.post<IDocente>(this.resourceUrl, docente, { observe: 'response' });
  }

  update(docente: IDocente): Observable<EntityResponseType> {
    return this.http.put<IDocente>(`${this.resourceUrl}/${getDocenteIdentifier(docente) as number}`, docente, { observe: 'response' });
  }

  partialUpdate(docente: IDocente): Observable<EntityResponseType> {
    return this.http.patch<IDocente>(`${this.resourceUrl}/${getDocenteIdentifier(docente) as number}`, docente, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDocente>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocente[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDocenteToCollectionIfMissing(docenteCollection: IDocente[], ...docentesToCheck: (IDocente | null | undefined)[]): IDocente[] {
    const docentes: IDocente[] = docentesToCheck.filter(isPresent);
    if (docentes.length > 0) {
      const docenteCollectionIdentifiers = docenteCollection.map(docenteItem => getDocenteIdentifier(docenteItem)!);
      const docentesToAdd = docentes.filter(docenteItem => {
        const docenteIdentifier = getDocenteIdentifier(docenteItem);
        if (docenteIdentifier == null || docenteCollectionIdentifiers.includes(docenteIdentifier)) {
          return false;
        }
        docenteCollectionIdentifiers.push(docenteIdentifier);
        return true;
      });
      return [...docentesToAdd, ...docenteCollection];
    }
    return docenteCollection;
  }
}
