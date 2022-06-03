import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPrueba, Prueba } from '../prueba.model';
import { PruebaService } from '../service/prueba.service';

@Injectable({ providedIn: 'root' })
export class PruebaRoutingResolveService implements Resolve<IPrueba> {
  constructor(protected service: PruebaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPrueba> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((prueba: HttpResponse<Prueba>) => {
          if (prueba.body) {
            return of(prueba.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Prueba());
  }
}
