import { Schema } from 'dynamoose';

export const UserClassSchema = new Schema(
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
    classId: { type: String },
  },
  {
    timestamps: true,
  },
);
