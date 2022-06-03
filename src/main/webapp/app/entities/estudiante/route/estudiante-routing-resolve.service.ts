import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstudiante, Estudiante } from '../estudiante.model';
import { EstudianteService } from '../service/estudiante.service';

@Injectable({ providedIn: 'root' })
export class EstudianteRoutingResolveService implements Resolve<IEstudiante> {
  constructor(protected service: EstudianteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEstudiante> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((estudiante: HttpResponse<Estudiante>) => {
          if (estudiante.body) {
            return of(estudiante.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Estudiante());
  }
}
