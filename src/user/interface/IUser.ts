export interface IUser {
  id?: number;
  username?: string;
  name?: string;
  location?: string;
  followers?: number;
  following?: number;
  created_at?: Date;
  languages?: string;
}
