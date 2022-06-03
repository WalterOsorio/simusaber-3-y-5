import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdministrador, getAdministradorIdentifier } from '../administrador.model';

export type EntityResponseType = HttpResponse<IAdministrador>;
export type EntityArrayResponseType = HttpResponse<IAdministrador[]>;

@Injectable({ providedIn: 'root' })
export class AdministradorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/administradors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(administrador: IAdministrador): Observable<EntityResponseType> {
    return this.http.post<IAdministrador>(this.resourceUrl, administrador, { observe: 'response' });
  }

  update(administrador: IAdministrador): Observable<EntityResponseType> {
    return this.http.put<IAdministrador>(`${this.resourceUrl}/${getAdministradorIdentifier(administrador) as number}`, administrador, {
      observe: 'response',
    });
  }

  partialUpdate(administrador: IAdministrador): Observable<EntityResponseType> {
    return this.http.patch<IAdministrador>(`${this.resourceUrl}/${getAdministradorIdentifier(administrador) as number}`, administrador, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdministrador>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdministrador[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAdministradorToCollectionIfMissing(
    administradorCollection: IAdministrador[],
    ...administradorsToCheck: (IAdministrador | null | undefined)[]
  ): IAdministrador[] {
    const administradors: IAdministrador[] = administradorsToCheck.filter(isPresent);
    if (administradors.length > 0) {
      const administradorCollectionIdentifiers = administradorCollection.map(
        administradorItem => getAdministradorIdentifier(administradorItem)!
      );
      const administradorsToAdd = administradors.filter(administradorItem => {
        const administradorIdentifier = getAdministradorIdentifier(administradorItem);
        if (administradorIdentifier == null || administradorCollectionIdentifiers.includes(administradorIdentifier)) {
          return false;
        }
        administradorCollectionIdentifiers.push(administradorIdentifier);
        return true;
      });
      return [...administradorsToAdd, ...administradorCollection];
    }
    return administradorCollection;
  }
}
