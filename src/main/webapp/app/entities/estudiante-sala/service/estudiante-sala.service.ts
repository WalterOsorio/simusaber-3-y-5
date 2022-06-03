import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstudianteSala, getEstudianteSalaIdentifier } from '../estudiante-sala.model';

export type EntityResponseType = HttpResponse<IEstudianteSala>;
export type EntityArrayResponseType = HttpResponse<IEstudianteSala[]>;

@Injectable({ providedIn: 'root' })
export class EstudianteSalaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estudiante-salas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(estudianteSala: IEstudianteSala): Observable<EntityResponseType> {
    return this.http.post<IEstudianteSala>(this.resourceUrl, estudianteSala, { observe: 'response' });
  }

  update(estudianteSala: IEstudianteSala): Observable<EntityResponseType> {
    return this.http.put<IEstudianteSala>(`${this.resourceUrl}/${getEstudianteSalaIdentifier(estudianteSala) as number}`, estudianteSala, {
      observe: 'response',
    });
  }

  partialUpdate(estudianteSala: IEstudianteSala): Observable<EntityResponseType> {
    return this.http.patch<IEstudianteSala>(
      `${this.resourceUrl}/${getEstudianteSalaIdentifier(estudianteSala) as number}`,
      estudianteSala,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstudianteSala>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstudianteSala[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEstudianteSalaToCollectionIfMissing(
    estudianteSalaCollection: IEstudianteSala[],
    ...estudianteSalasToCheck: (IEstudianteSala | null | undefined)[]
  ): IEstudianteSala[] {
    const estudianteSalas: IEstudianteSala[] = estudianteSalasToCheck.filter(isPresent);
    if (estudianteSalas.length > 0) {
      const estudianteSalaCollectionIdentifiers = estudianteSalaCollection.map(
        estudianteSalaItem => getEstudianteSalaIdentifier(estudianteSalaItem)!
      );
      const estudianteSalasToAdd = estudianteSalas.filter(estudianteSalaItem => {
        const estudianteSalaIdentifier = getEstudianteSalaIdentifier(estudianteSalaItem);
        if (estudianteSalaIdentifier == null || estudianteSalaCollectionIdentifiers.includes(estudianteSalaIdentifier)) {
          return false;
        }
        estudianteSalaCollectionIdentifiers.push(estudianteSalaIdentifier);
        return true;
      });
      return [...estudianteSalasToAdd, ...estudianteSalaCollection];
    }
    return estudianteSalaCollection;
  }
}
