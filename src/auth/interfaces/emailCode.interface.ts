export interface EmailCodeKey {
  PK: string;
  SK: string;
}

export interface EmailCode extends EmailCodeKey {
  code: string;
}
