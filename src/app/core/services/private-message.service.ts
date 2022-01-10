import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CyberbookServerResponse } from '@cyberbook/core/model/cyberbook-server-response';
import { PrivateMessage } from '@cyberbook/core/model/private-message';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class PrivateMessageService {
  readonly privateMessageRoute = `${environment.server}/private-messages`;

  constructor(private http: HttpClient) {
  }

  loadPrivateMessagesByMessageThreadId(messageThreadId: string): Observable<PrivateMessage[]> {
    return this.http.get<CyberbookServerResponse>(`${this.privateMessageRoute}/message-thread/${messageThreadId}`).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }

  sendPrivateMessage(privateMessage: Partial<PrivateMessage>): Observable<PrivateMessage> {
    return this.http.post<CyberbookServerResponse>(`${this.privateMessageRoute}/feedback`, privateMessage).pipe(
      map((res: CyberbookServerResponse) => res.data)
    );
  }
}
