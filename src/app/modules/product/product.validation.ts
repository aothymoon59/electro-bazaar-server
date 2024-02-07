import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string(),
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

const productValidations = { createProductValidationSchema };

export default productValidations;
