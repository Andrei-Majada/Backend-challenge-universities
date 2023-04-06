import { Types } from 'mongoose';

export interface IAuth {
  access_token: string;
}

export interface ICreateUser {
  id: Types.ObjectId;
  name: string;
  email: string;
}
