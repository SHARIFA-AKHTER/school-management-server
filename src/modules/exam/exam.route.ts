import express from 'express';
import { ExamController } from './exam.controller.js';
import { ExamValidation } from './exam.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';


const router = express.Router();

router.get('/', ExamController.getAllExams);
router.get('/:id', ExamController.getSingleExam);

router.post(
  '/create-exam',
  validateRequest(ExamValidation.createExamZodSchema),
  ExamController.createExam
);

export const ExamRoutes = router;