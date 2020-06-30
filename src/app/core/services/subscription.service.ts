import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Subscription } from '../model/subscription';

@Injectable()
export class SubscriptionService {
  readonly subscriptionRoute = `${environment.server}/subscription`;

  constructor(private http: HttpClient) {
  }

  loadSubscriptionsByUser(userId: string): Observable<Subscription[]> {
    return <Observable<Subscription[]>>this.http.get(`${this.subscriptionRoute}`, { params: { userId } });
  }

  addSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    // TODO: remove after server can do this
    subscription = {
      ...subscription,
      dateCreated: subscription.dateCreated,
      dateModified: subscription.dateCreated,
    }

    return <Observable<Subscription>>this.http.post(`${this.subscriptionRoute}`, subscription);
  }

  updateSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    return <Observable<Subscription>>this.http.put(`${this.subscriptionRoute}/${subscription.id}`, subscription);
  }

  removeSubscription(id: string): Observable<any> {
    return this.http.delete(`${this.subscriptionRoute}/${id}`);
  }
}
