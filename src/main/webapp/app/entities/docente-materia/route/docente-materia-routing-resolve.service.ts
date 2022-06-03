import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDocenteMateria, DocenteMateria } from '../docente-materia.model';
import { DocenteMateriaService } from '../service/docente-materia.service';

@Injectable({ providedIn: 'root' })
export class DocenteMateriaRoutingResolveService implements Resolve<IDocenteMateria> {
  constructor(protected service: DocenteMateriaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocenteMateria> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((docenteMateria: HttpResponse<DocenteMateria>) => {
          if (docenteMateria.body) {
            return of(docenteMateria.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DocenteMateria());
  }
}
