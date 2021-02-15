export interface User {
  name: string;
  email: string;
  picture: string;
  createdAt: Date;
  is_admin: boolean;
  is_ta: boolean;
  is_instructor: boolean;
}
