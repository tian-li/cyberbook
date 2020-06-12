import { User } from '@spend-book/core/model/user';
import { v4 as uuid } from 'uuid';

export function createTempUser(): Partial<User> {
  const id: string = uuid();

  return {
    id,
    username: '新用户' + id.substring(0, 4),
    registered: false
  };
}
