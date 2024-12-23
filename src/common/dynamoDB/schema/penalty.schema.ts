import { Schema } from 'dynamoose';

export const PenaltySchema = new Schema(
  {
    PK: {
      type: String,
      hashKey: true,
      required: true,
    },
    SK: {
      type: String,
      rangeKey: true,
      required: true,
      index: { name: 'inverted-index', type: 'global' },
    },
    alaramDate: { type: String },
    alarmType: { type: String },
    alarmMessage: { type: String },
  },
  {
    timestamps: true,
  },
);
