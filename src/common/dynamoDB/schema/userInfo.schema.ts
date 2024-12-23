import { Schema } from 'dynamoose';

export const UserInfoSchema = new Schema(
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
    email: { type: String },
    pwd: { type: String },
    role: { type: String },
    isVerified: { type: Boolean },
    profile: { type: String },
    name: { type: String },
    studentId: { type: String },
  },
  {
    timestamps: true,
  },
);
