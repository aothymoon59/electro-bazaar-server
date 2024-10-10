import { z } from 'zod';

const createCartValidationSchema = z.object({
  body: z.object({
    product_id: z.string(),
    product_name: z.string(),
    product_image: z.string().optional(),
    price: z.number(),
    quantity: z.number(),
  }),
});

const cartValidations = { createCartValidationSchema };

export default cartValidations;
