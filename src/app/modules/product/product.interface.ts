import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  quantity: number;
  releaseDate: Date;
  brand: string;
  modelNumber: string;
  category: string;
  operatingSystem?: string;
  connectivity?: string;
  powerSource?: string;
  features?: {
    cameraResolution?: number;
    storageCapacity?: number;
  };
}
