import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserData, getUserDataIdentifier } from '../user-data.model';

export type EntityResponseType = HttpResponse<IUserData>;
export type EntityArrayResponseType = HttpResponse<IUserData[]>;

@Injectable({ providedIn: 'root' })
export class UserDataService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-data');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userData: IUserData): Observable<EntityResponseType> {
    return this.http.post<IUserData>(this.resourceUrl, userData, { observe: 'response' });
  }

  update(userData: IUserData): Observable<EntityResponseType> {
    return this.http.put<IUserData>(`${this.resourceUrl}/${getUserDataIdentifier(userData) as number}`, userData, { observe: 'response' });
  }

  partialUpdate(userData: IUserData): Observable<EntityResponseType> {
    return this.http.patch<IUserData>(`${this.resourceUrl}/${getUserDataIdentifier(userData) as number}`, userData, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserData>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserData[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserDataToCollectionIfMissing(userDataCollection: IUserData[], ...userDataToCheck: (IUserData | null | undefined)[]): IUserData[] {
    const userData: IUserData[] = userDataToCheck.filter(isPresent);
    if (userData.length > 0) {
      const userDataCollectionIdentifiers = userDataCollection.map(userDataItem => getUserDataIdentifier(userDataItem)!);
      const userDataToAdd = userData.filter(userDataItem => {
        const userDataIdentifier = getUserDataIdentifier(userDataItem);
        if (userDataIdentifier == null || userDataCollectionIdentifiers.includes(userDataIdentifier)) {
          return false;
        }
        userDataCollectionIdentifiers.push(userDataIdentifier);
        return true;
      });
      return [...userDataToAdd, ...userDataCollection];
    }
    return userDataCollection;
  }
}
