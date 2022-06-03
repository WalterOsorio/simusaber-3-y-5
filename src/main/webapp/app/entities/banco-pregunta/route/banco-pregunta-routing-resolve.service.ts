import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBancoPregunta, BancoPregunta } from '../banco-pregunta.model';
import { BancoPreguntaService } from '../service/banco-pregunta.service';

@Injectable({ providedIn: 'root' })
export class BancoPreguntaRoutingResolveService implements Resolve<IBancoPregunta> {
  constructor(protected service: BancoPreguntaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBancoPregunta> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bancoPregunta: HttpResponse<BancoPregunta>) => {
          if (bancoPregunta.body) {
            return of(bancoPregunta.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BancoPregunta());
  }
}
