export interface ClassKey {
  PK: string;
  SK: string;
}

export interface Class extends ClassKey {
  className: string;
  manager: string;
  classDescription: string;
  classImage: string;
  classCode: string;
  classDate: string[];
  classStartTime: string;
  classEndTime: string;
  voteEnd: number;
  votePercent: number;
  penaltyType: number;
}
