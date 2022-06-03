import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISalaMateria, SalaMateria } from '../sala-materia.model';
import { SalaMateriaService } from '../service/sala-materia.service';

@Injectable({ providedIn: 'root' })
export class SalaMateriaRoutingResolveService implements Resolve<ISalaMateria> {
  constructor(protected service: SalaMateriaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISalaMateria> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((salaMateria: HttpResponse<SalaMateria>) => {
          if (salaMateria.body) {
            return of(salaMateria.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SalaMateria());
  }
}
