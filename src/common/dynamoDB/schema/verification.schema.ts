import { Schema } from 'dynamoose';

export const VerificationSchema = new Schema(
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
    verificationImage: { type: String },
    verificationDate: { type: String },
    verificationStatus: { type: Number },
    yesVote: { type: Number },
    noVote: { type: Number },
    userName: { type: String },
  },
  {
    timestamps: true,
  },
);
