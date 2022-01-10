import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CyberbookServerResponse } from '@cyberbook/core/model/cyberbook-server-response';
import { MessageThread } from '@cyberbook/core/model/message-thread';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class MessageThreadService {
  readonly messageThreadRoute = `${environment.server}/message-threads`;

  constructor(private http: HttpClient) {
  }

  loadAllMessageThreadsByUser(): Observable<MessageThread[]> {
    return this.http.get<CyberbookServerResponse>(`${this.messageThreadRoute}`).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  loadMessageThreadById(messageThreadId: string): Observable<MessageThread> {
    return this.http.get<CyberbookServerResponse>(`${this.messageThreadRoute}/${messageThreadId}`).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }
}
