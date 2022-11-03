import * as yup from 'yup';

export const createOrderRequestSchema = yup.object({
  items: yup
    .array()
    .of(yup.object({ product_id: yup.string().required(), quantity: yup.number().min(1).max(10).required() }))
    .required(),
});
