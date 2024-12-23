export interface UserInfoKey {
  PK: string;
  SK: string;
}

export interface UserInfo extends UserInfoKey {
  email: string;
  pwd: string;
  role: string;
  isVerified: boolean;
  profile: string;
  name: string;
  studentId: string;
}
