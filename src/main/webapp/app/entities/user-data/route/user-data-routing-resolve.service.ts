import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserData, UserData } from '../user-data.model';
import { UserDataService } from '../service/user-data.service';

@Injectable({ providedIn: 'root' })
export class UserDataRoutingResolveService implements Resolve<IUserData> {
  constructor(protected service: UserDataService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserData> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userData: HttpResponse<UserData>) => {
          if (userData.body) {
            return of(userData.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserData());
  }
}
