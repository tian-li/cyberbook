import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { CyberbookServerResponse } from '@cyberbook/core/model/cyberbook-server-response';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Subscription } from '../model/subscription';

@Injectable()
export class SubscriptionService {
  readonly subscriptionRoute = `${environment.server}/subscriptions`;

  constructor(private http: HttpClient) {
  }

  loadSubscriptionsByUser(): Observable<Subscription[]> {
    return <Observable<Subscription[]>>this.http.get(`${this.subscriptionRoute}`).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  addSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    return <Observable<Subscription>>this.http.post(`${this.subscriptionRoute}`, subscription).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  updateSubscription(subscription: Update<Subscription>): Observable<Subscription> {
    return <Observable<Subscription>>this.http.put(`${this.subscriptionRoute}/${subscription.id}`, subscription.changes).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  stopSubscription(id: string): Observable<Subscription> {
    const changes = {
      // Need to get end data on client to make it at correct time in local time zone
      // endDate: dayjs().startOf('day').toISOString(),
      endDate: dayjs().startOf('minute').toISOString(), // test with minute
    }
    return <Observable<Subscription>>this.http.post(`${this.subscriptionRoute}/stop/${id}`, changes).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  removeSubscription(id: string): Observable<any> {
    return this.http.delete(`${this.subscriptionRoute}/${id}`);
  }
}
