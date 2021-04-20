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
  _id: string;
  visible: boolean;
  input: string;
  output: string;
  verdict?: string;
  got_output?: boolean;
};

export type Problem = {
  name: string;
  _id: string;
  problem_statement: string;
  language: string;
  testcases: Testcase[];
};

export type AssignmentDetails = {
  _id: string;
  name: string;
  start: string;
  student_ids: string[];
  prof_id: string;
  ta_id: string;
  end: string;
  problems: [Problem];
};
type CustomError = { message: string };

export type GlobalError = XOR<CustomError, ValidatorError>;

export type Submission = {
  he_id: string;
  status_update_url: string;
  assignment_id: string;
  submitter_google_id: string;
  created: Date;
  verdict: string;
  code: string;
  testcase_id: string;
  evaluated: boolean;
  language: string;
  stdin: string;
  stdout: string;
  time_used: string;
};

export type Result = {
  assignment: AssignmentDetails;
  submissions: {
    student: User;
    submissions: Submission[];
  }[];
};
