import { ISOString } from '../../shared/model/helper-models';

export interface MessageThread {
  id: string;
  users: string[];
  type: number;
  preview: string;
  lastMessageDate: ISOString;
}
