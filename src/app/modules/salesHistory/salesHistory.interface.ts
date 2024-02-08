import { Types } from 'mongoose';

export interface ISalesHistory {
  productId: Types.ObjectId;
  quantity: number;
  buyerName: string;
  buyDate: Date;
}
