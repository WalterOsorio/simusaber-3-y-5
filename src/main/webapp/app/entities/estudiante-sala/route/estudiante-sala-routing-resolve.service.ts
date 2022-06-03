import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstudianteSala, EstudianteSala } from '../estudiante-sala.model';
import { EstudianteSalaService } from '../service/estudiante-sala.service';

@Injectable({ providedIn: 'root' })
export class EstudianteSalaRoutingResolveService implements Resolve<IEstudianteSala> {
  constructor(protected service: EstudianteSalaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEstudianteSala> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((estudianteSala: HttpResponse<EstudianteSala>) => {
          if (estudianteSala.body) {
            return of(estudianteSala.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EstudianteSala());
  }
}
