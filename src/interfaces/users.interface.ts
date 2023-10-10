export interface User {
  _id: string;
  email: string;
  type: string;
  firstName: string;
  lastName: string;
  userName: string;
  date_of_birth: Date;
  gender: string;
  city: string;
  country: string;
  status: string;
  password: string;
  passport_back: string;
  passport_front: string;
  isEmailVerified: boolean;
}
