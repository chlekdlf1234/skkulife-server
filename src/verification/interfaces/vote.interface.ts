export interface VoteKey {
  PK: string;
  SK: string;
}

export interface Vote extends VoteKey {
  verificationId: string;
  vote: boolean;
}
