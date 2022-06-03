import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISala, getSalaIdentifier } from '../sala.model';

export type EntityResponseType = HttpResponse<ISala>;
export type EntityArrayResponseType = HttpResponse<ISala[]>;

@Injectable({ providedIn: 'root' })
export class SalaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/salas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sala: ISala): Observable<EntityResponseType> {
    return this.http.post<ISala>(this.resourceUrl, sala, { observe: 'response' });
  }

  update(sala: ISala): Observable<EntityResponseType> {
    return this.http.put<ISala>(`${this.resourceUrl}/${getSalaIdentifier(sala) as number}`, sala, { observe: 'response' });
  }

  partialUpdate(sala: ISala): Observable<EntityResponseType> {
    return this.http.patch<ISala>(`${this.resourceUrl}/${getSalaIdentifier(sala) as number}`, sala, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISala>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISala[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSalaToCollectionIfMissing(salaCollection: ISala[], ...salasToCheck: (ISala | null | undefined)[]): ISala[] {
    const salas: ISala[] = salasToCheck.filter(isPresent);
    if (salas.length > 0) {
      const salaCollectionIdentifiers = salaCollection.map(salaItem => getSalaIdentifier(salaItem)!);
      const salasToAdd = salas.filter(salaItem => {
        const salaIdentifier = getSalaIdentifier(salaItem);
        if (salaIdentifier == null || salaCollectionIdentifiers.includes(salaIdentifier)) {
          return false;
        }
        salaCollectionIdentifiers.push(salaIdentifier);
        return true;
      });
      return [...salasToAdd, ...salaCollection];
    }
    return salaCollection;
  }
}
