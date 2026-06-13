import { z } from 'zod';

const createResultZodSchema = z.object({
  body: z.object({
    studentId: z
      .string()
      .trim()
      .min(1, 'Student ID is required'),

    subjectId: z
      .string()
      .trim()
      .min(1, 'Subject ID is required'),

    marks: z
      .number({
     
   
      })
      .min(0, 'Marks cannot be less than 0')
      .max(100, 'Marks cannot be greater than 100'),
    examId: z
      .string()
      .trim()
      .optional()
      .nullable(),
  }),
});

export const ResultValidation = {
  createResultZodSchema,
};