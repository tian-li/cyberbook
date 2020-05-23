import { ISOString } from '@spend-book/shared/model/helper-models';

export interface User {
  id: string;
  // TODO: can't use custom id with json-server, in future, when backend is ready, will use this as id
  // userId: string;
  username: string;
  profilePhotoURL: string;
  email: string;
  registeredDate: ISOString;
  gender: string;
  birthday: ISOString;
  registered: boolean;
}
