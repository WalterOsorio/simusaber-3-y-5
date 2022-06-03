import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITipoDocumento, TipoDocumento } from '../tipo-documento.model';
import { TipoDocumentoService } from '../service/tipo-documento.service';

@Injectable({ providedIn: 'root' })
export class TipoDocumentoRoutingResolveService implements Resolve<ITipoDocumento> {
  constructor(protected service: TipoDocumentoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITipoDocumento> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tipoDocumento: HttpResponse<TipoDocumento>) => {
          if (tipoDocumento.body) {
            return of(tipoDocumento.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TipoDocumento());
  }
}
