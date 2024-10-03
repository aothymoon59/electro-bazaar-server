import { Types } from 'mongoose';

export interface ISalesHistory {
  slNo: number;
  productId: Types.ObjectId;
  quantity: number;
  buyerName: string;
  buyDate: Date;
}
