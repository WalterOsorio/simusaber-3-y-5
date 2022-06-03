import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdministrador, Administrador } from '../administrador.model';
import { AdministradorService } from '../service/administrador.service';

@Injectable({ providedIn: 'root' })
export class AdministradorRoutingResolveService implements Resolve<IAdministrador> {
  constructor(protected service: AdministradorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdministrador> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((administrador: HttpResponse<Administrador>) => {
          if (administrador.body) {
            return of(administrador.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Administrador());
  }
}
