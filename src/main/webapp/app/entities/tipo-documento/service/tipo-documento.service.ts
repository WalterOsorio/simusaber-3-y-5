import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITipoDocumento, getTipoDocumentoIdentifier } from '../tipo-documento.model';

export type EntityResponseType = HttpResponse<ITipoDocumento>;
export type EntityArrayResponseType = HttpResponse<ITipoDocumento[]>;

@Injectable({ providedIn: 'root' })
export class TipoDocumentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tipo-documentos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tipoDocumento: ITipoDocumento): Observable<EntityResponseType> {
    return this.http.post<ITipoDocumento>(this.resourceUrl, tipoDocumento, { observe: 'response' });
  }

  update(tipoDocumento: ITipoDocumento): Observable<EntityResponseType> {
    return this.http.put<ITipoDocumento>(`${this.resourceUrl}/${getTipoDocumentoIdentifier(tipoDocumento) as number}`, tipoDocumento, {
      observe: 'response',
    });
  }

  partialUpdate(tipoDocumento: ITipoDocumento): Observable<EntityResponseType> {
    return this.http.patch<ITipoDocumento>(`${this.resourceUrl}/${getTipoDocumentoIdentifier(tipoDocumento) as number}`, tipoDocumento, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITipoDocumento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITipoDocumento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTipoDocumentoToCollectionIfMissing(
    tipoDocumentoCollection: ITipoDocumento[],
    ...tipoDocumentosToCheck: (ITipoDocumento | null | undefined)[]
  ): ITipoDocumento[] {
    const tipoDocumentos: ITipoDocumento[] = tipoDocumentosToCheck.filter(isPresent);
    if (tipoDocumentos.length > 0) {
      const tipoDocumentoCollectionIdentifiers = tipoDocumentoCollection.map(
        tipoDocumentoItem => getTipoDocumentoIdentifier(tipoDocumentoItem)!
      );
      const tipoDocumentosToAdd = tipoDocumentos.filter(tipoDocumentoItem => {
        const tipoDocumentoIdentifier = getTipoDocumentoIdentifier(tipoDocumentoItem);
        if (tipoDocumentoIdentifier == null || tipoDocumentoCollectionIdentifiers.includes(tipoDocumentoIdentifier)) {
          return false;
        }
        tipoDocumentoCollectionIdentifiers.push(tipoDocumentoIdentifier);
        return true;
      });
      return [...tipoDocumentosToAdd, ...tipoDocumentoCollection];
    }
    return tipoDocumentoCollection;
  }
}
