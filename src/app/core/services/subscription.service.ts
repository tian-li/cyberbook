import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { CyberbookServerResponse } from '@spend-book/core/model/cyberbook-server-response';
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

  loadSubscriptionsByUser(userId: string): Observable<Subscription[]> {
    return <Observable<Subscription[]>>this.http.get(`${this.subscriptionRoute}`, { params: { userId } }).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  addSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    // TODO: remove after server can do this
    subscription = {
      ...subscription,
      dateCreated: subscription.dateCreated,
      dateModified: subscription.dateCreated,
    }

    return <Observable<Subscription>>this.http.post(`${this.subscriptionRoute}`, subscription).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  updateSubscription(subscription: Update<Subscription>): Observable<Subscription> {
    return <Observable<Subscription>>this.http.patch(`${this.subscriptionRoute}/${subscription.id}`, subscription.changes).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  stopSubscription(id: string): Observable<Subscription> {
    const changes = {
      endDate: dayjs().startOf('day').toISOString(),
      dateModified: dayjs().toISOString(),
    }
    return <Observable<Subscription>>this.http.patch(`${this.subscriptionRoute}/${id}`, changes).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  removeSubscription(id: string): Observable<any> {
    return this.http.delete(`${this.subscriptionRoute}/${id}`);
  }
}
