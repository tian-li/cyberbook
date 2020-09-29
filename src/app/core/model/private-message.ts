import { ISOString } from '../../shared/model/helper-models';

export interface PrivateMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  messageThreadId: string;
  dateCreated: ISOString;
}
