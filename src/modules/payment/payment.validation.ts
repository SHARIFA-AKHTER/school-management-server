// import { z } from 'zod';

// const createPaymentZodSchema = z.object({
//   body: z.object({
//     amount: z
//       .number()
//       .positive('Amount must be greater than 0'),

//     // status: z
//     //   .enum(['PENDING', 'PAID', 'FAILED'])
//     //   .default('PENDING'),

//     // transactionId: z
//     //   .string()
//     //   .trim()
//     //   .min(1, 'Transaction ID is required'),

//     purpose: z
//       .string()
//       .trim()
//       .min(1, 'Payment purpose is required'),

//     studentId: z
//       .string()
//       .trim()
//       .min(1, 'Student unique reference ID is required'),
//   }),
// });

// export const PaymentValidation = {
//   createPaymentZodSchema,
// };

import { z } from 'zod';

const createPaymentZodSchema = z.object({
  body: z.object({
    amount: z
      .number() 
      .positive('Amount must be greater than 0'),

    purpose: z
      .string()
      .trim()
      .min(1, 'Payment purpose is required'),

    studentId: z
      .string()
      .trim()
      .min(1, 'Student unique reference ID is required'),
  }),
});

export const PaymentValidation = {
  createPaymentZodSchema,
};