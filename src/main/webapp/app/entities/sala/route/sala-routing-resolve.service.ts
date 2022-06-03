import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISala, Sala } from '../sala.model';
import { SalaService } from '../service/sala.service';

@Injectable({ providedIn: 'root' })
export class SalaRoutingResolveService implements Resolve<ISala> {
  constructor(protected service: SalaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISala> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sala: HttpResponse<Sala>) => {
          if (sala.body) {
            return of(sala.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Sala());
  }
}
