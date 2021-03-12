import { MessageThread } from '@cyberbook/core/model/message-thread';
import { FullDateType, ISOString } from '@cyberbook/shared/model/helper-models';
import * as dayjs from 'dayjs';

export interface User {
  id: string;
  username: string;
  profilePhotoURL: string;
  email: string;
  dateRegistered: ISOString;
  gender: number;
  birthday: FullDateType;
  registered: boolean;
  jwtToken: string;
  theme: string;
  messageThreads: MessageThread[];
}

export function registeredDays(user: User): number {
  return dayjs().diff(dayjs(user.dateRegistered), 'day');
}
