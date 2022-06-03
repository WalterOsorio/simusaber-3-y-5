import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPruebaApoyo, getPruebaApoyoIdentifier } from '../prueba-apoyo.model';

export type EntityResponseType = HttpResponse<IPruebaApoyo>;
export type EntityArrayResponseType = HttpResponse<IPruebaApoyo[]>;

@Injectable({ providedIn: 'root' })
export class PruebaApoyoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prueba-apoyos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pruebaApoyo: IPruebaApoyo): Observable<EntityResponseType> {
    return this.http.post<IPruebaApoyo>(this.resourceUrl, pruebaApoyo, { observe: 'response' });
  }

  update(pruebaApoyo: IPruebaApoyo): Observable<EntityResponseType> {
    return this.http.put<IPruebaApoyo>(`${this.resourceUrl}/${getPruebaApoyoIdentifier(pruebaApoyo) as number}`, pruebaApoyo, {
      observe: 'response',
    });
  }

  partialUpdate(pruebaApoyo: IPruebaApoyo): Observable<EntityResponseType> {
    return this.http.patch<IPruebaApoyo>(`${this.resourceUrl}/${getPruebaApoyoIdentifier(pruebaApoyo) as number}`, pruebaApoyo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPruebaApoyo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPruebaApoyo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPruebaApoyoToCollectionIfMissing(
    pruebaApoyoCollection: IPruebaApoyo[],
    ...pruebaApoyosToCheck: (IPruebaApoyo | null | undefined)[]
  ): IPruebaApoyo[] {
    const pruebaApoyos: IPruebaApoyo[] = pruebaApoyosToCheck.filter(isPresent);
    if (pruebaApoyos.length > 0) {
      const pruebaApoyoCollectionIdentifiers = pruebaApoyoCollection.map(pruebaApoyoItem => getPruebaApoyoIdentifier(pruebaApoyoItem)!);
      const pruebaApoyosToAdd = pruebaApoyos.filter(pruebaApoyoItem => {
        const pruebaApoyoIdentifier = getPruebaApoyoIdentifier(pruebaApoyoItem);
        if (pruebaApoyoIdentifier == null || pruebaApoyoCollectionIdentifiers.includes(pruebaApoyoIdentifier)) {
          return false;
        }
        pruebaApoyoCollectionIdentifiers.push(pruebaApoyoIdentifier);
        return true;
      });
      return [...pruebaApoyosToAdd, ...pruebaApoyoCollection];
    }
    return pruebaApoyoCollection;
  }
}
