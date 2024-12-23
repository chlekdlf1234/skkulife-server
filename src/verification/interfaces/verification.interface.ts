export interface VerificationKey {
  PK: string;
  SK: string;
}

export interface Verification extends VerificationKey {
  verificationId: string;
  verificationImage: string;
  verificationDate: string;
  verificationStatus: number;
  yesVote: number;
  noVote: number;
  userName: string;
}
