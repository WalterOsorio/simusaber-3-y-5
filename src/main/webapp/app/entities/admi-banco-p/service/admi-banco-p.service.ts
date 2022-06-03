import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdmiBancoP, getAdmiBancoPIdentifier } from '../admi-banco-p.model';

export type EntityResponseType = HttpResponse<IAdmiBancoP>;
export type EntityArrayResponseType = HttpResponse<IAdmiBancoP[]>;

@Injectable({ providedIn: 'root' })
export class AdmiBancoPService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/admi-banco-ps');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(admiBancoP: IAdmiBancoP): Observable<EntityResponseType> {
    return this.http.post<IAdmiBancoP>(this.resourceUrl, admiBancoP, { observe: 'response' });
  }

  update(admiBancoP: IAdmiBancoP): Observable<EntityResponseType> {
    return this.http.put<IAdmiBancoP>(`${this.resourceUrl}/${getAdmiBancoPIdentifier(admiBancoP) as number}`, admiBancoP, {
      observe: 'response',
    });
  }

  partialUpdate(admiBancoP: IAdmiBancoP): Observable<EntityResponseType> {
    return this.http.patch<IAdmiBancoP>(`${this.resourceUrl}/${getAdmiBancoPIdentifier(admiBancoP) as number}`, admiBancoP, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdmiBancoP>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdmiBancoP[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAdmiBancoPToCollectionIfMissing(
    admiBancoPCollection: IAdmiBancoP[],
    ...admiBancoPSToCheck: (IAdmiBancoP | null | undefined)[]
  ): IAdmiBancoP[] {
    const admiBancoPS: IAdmiBancoP[] = admiBancoPSToCheck.filter(isPresent);
    if (admiBancoPS.length > 0) {
      const admiBancoPCollectionIdentifiers = admiBancoPCollection.map(admiBancoPItem => getAdmiBancoPIdentifier(admiBancoPItem)!);
      const admiBancoPSToAdd = admiBancoPS.filter(admiBancoPItem => {
        const admiBancoPIdentifier = getAdmiBancoPIdentifier(admiBancoPItem);
        if (admiBancoPIdentifier == null || admiBancoPCollectionIdentifiers.includes(admiBancoPIdentifier)) {
          return false;
        }
        admiBancoPCollectionIdentifiers.push(admiBancoPIdentifier);
        return true;
      });
      return [...admiBancoPSToAdd, ...admiBancoPCollection];
    }
    return admiBancoPCollection;
  }
}
