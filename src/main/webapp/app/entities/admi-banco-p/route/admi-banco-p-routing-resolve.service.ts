import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdmiBancoP, AdmiBancoP } from '../admi-banco-p.model';
import { AdmiBancoPService } from '../service/admi-banco-p.service';

@Injectable({ providedIn: 'root' })
export class AdmiBancoPRoutingResolveService implements Resolve<IAdmiBancoP> {
  constructor(protected service: AdmiBancoPService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAdmiBancoP> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((admiBancoP: HttpResponse<AdmiBancoP>) => {
          if (admiBancoP.body) {
            return of(admiBancoP.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AdmiBancoP());
  }
}
