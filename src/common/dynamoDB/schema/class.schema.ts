import { Schema } from 'dynamoose';

export const ClassSchema = new Schema(
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
    className: { type: String },
    classId: { type: String },
    manager: { type: String },
    classDescription: { type: String },
    classImage: { type: String },
    classCode: {
      type: String,
      index: { name: 'classCode-index', type: 'global' },
    },
    classDate: { type: Array, schema: [String] },
    classStartTime: { type: String },
    classEndTime: { type: String },
    voteEnd: { type: Number },
    votePercent: { type: Number },
    penaltyType: { type: Number },
  },
  {
    timestamps: true,
  },
);
