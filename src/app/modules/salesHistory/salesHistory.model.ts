import { Schema, model } from 'mongoose';
import { ISalesHistory } from './salesHistory.interface';

const SalesHistorySchema = new Schema<ISalesHistory>(
  {
    slNo: { type: Number },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    buyerName: { type: String },
    buyDate: { type: Date },
  },
  { timestamps: true },
);

export const SalesHistory = model<ISalesHistory>(
  'SalesHistory',
  SalesHistorySchema,
);
