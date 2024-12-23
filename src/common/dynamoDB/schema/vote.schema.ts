import { Schema } from 'dynamoose';

export const VoteSchema = new Schema(
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
    verificationId: {
      type: String,
      index: { name: 'verificationId-index', type: 'global' },
    },
    vote: { type: Boolean },
  },
  {
    timestamps: true,
  },
);
