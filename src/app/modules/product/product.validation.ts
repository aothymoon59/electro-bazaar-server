import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    productImage: z.string(),
    price: z.number(),
    quantity: z.number(),
    releaseDate: z.string(),
    brand: z.string(),
    modelNumber: z.string(),
    category: z.string(),
    operatingSystem: z.string().optional(),
    connectivity: z.string().optional(),
    powerSource: z.string().optional(),
    features: z
      .object({
        cameraResolution: z.number().optional(),
        storageCapacity: z.number().optional(),
      })
      .optional(),
  }),
});
const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    productImage: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
    releaseDate: z.string().optional(),
    brand: z.string().optional(),
    modelNumber: z.string().optional(),
    category: z.string().optional(),
    operatingSystem: z.string().optional(),
    connectivity: z.string().optional(),
    powerSource: z.string().optional(),
    features: z
      .object({
        cameraResolution: z.number().optional(),
        storageCapacity: z.number().optional(),
      })
      .optional(),
  }),
});

export const productValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
