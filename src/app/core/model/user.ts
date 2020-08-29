import { FullDateType, ISOString } from '@spend-book/shared/model/helper-models';

export interface User {
  id: string;
  username: string;
  profilePhotoURL: string;
  email: string;
  registeredDate: ISOString;
  gender: number;
  birthday: FullDateType;
  registered: boolean;
  jwtToken: string;
}
