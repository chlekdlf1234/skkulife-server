export interface PenaltyKey {
  PK: string;
  SK: string;
}

export interface Penalty extends PenaltyKey {
  alaramDate: string;
  alarmType: string;
  alarmMessage: string;
}
