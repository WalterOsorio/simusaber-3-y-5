import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPruebaApoyo, PruebaApoyo } from '../prueba-apoyo.model';
import { PruebaApoyoService } from '../service/prueba-apoyo.service';

@Injectable({ providedIn: 'root' })
export class PruebaApoyoRoutingResolveService implements Resolve<IPruebaApoyo> {
  constructor(protected service: PruebaApoyoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPruebaApoyo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pruebaApoyo: HttpResponse<PruebaApoyo>) => {
          if (pruebaApoyo.body) {
            return of(pruebaApoyo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PruebaApoyo());
  }
}
