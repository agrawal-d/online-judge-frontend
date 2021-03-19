type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export interface User {
  google_id: string;
  name: string;
  email: string;
  picture: string;
  createdAt: Date;
  is_admin: boolean;
  is_ta: boolean;
  he_client_id: string;
  he_client_secret: string;
  is_instructor: boolean;
}

type ValidatorError = {
  validatorError: true;
  msg: string;
  value: string;
  param: string;
  location: string;
};

export type Testcase = {
  id: string;
  input: string;
  output: string;
  verdict?: string;
  got_output?: boolean;
};

export type Problem = {
  name: string;
  id: string;
  statement: string;
  language: string;
  testcases: [Testcase];
};

export type AssignmentDetails = {
  id: string;
  name: string;
  start: string;
  end: string;
  problems: [Problem];
};
type CustomError = { message: string };

export type GlobalError = XOR<CustomError, ValidatorError>;
