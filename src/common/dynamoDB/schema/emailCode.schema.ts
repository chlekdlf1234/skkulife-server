import { Schema } from 'dynamoose';

export const EmailCodeSchema = new Schema(
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
    code: { type: String },
  },
  {
    timestamps: true,
  },
);
