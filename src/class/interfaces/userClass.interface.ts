export interface UserClassKey {
  PK: string;
  SK: string;
}

export interface UserClass extends UserClassKey {
  classId: string;
}
