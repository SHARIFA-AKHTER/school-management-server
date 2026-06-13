import { z } from 'zod';

const sendInvoiceEmailZodSchema = z.object({
  body: z.object({
    to: z
      .string()
      .min(1, 'Receiver email is required')
      .email('Invalid email address format'),

    paymentData: z.object({
      transactionId: z
        .string()
        .min(1, 'Transaction ID is required'),

      amount: z
        .number()
        .positive('Amount must be a positive number'),

      purpose: z
        .string()
        .min(1, 'Payment purpose is required'),

      studentId: z
        .string()
        .min(1, 'Student ID is required'),

      studentName: z
        .string()
        .min(1, 'Student Name is required'),
    }),
  }),
});

export const EmailValidation = {
  sendInvoiceEmailZodSchema,
};