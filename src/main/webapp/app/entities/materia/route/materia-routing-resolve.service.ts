import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMateria, Materia } from '../materia.model';
import { MateriaService } from '../service/materia.service';

@Injectable({ providedIn: 'root' })
export class MateriaRoutingResolveService implements Resolve<IMateria> {
  constructor(protected service: MateriaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMateria> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((materia: HttpResponse<Materia>) => {
          if (materia.body) {
            return of(materia.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Materia());
  }
}
