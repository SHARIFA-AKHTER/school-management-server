import express from 'express';
import { PaymentController } from './payment.controller.js';
import { PaymentValidation } from './payment.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';


const router = express.Router();

router.get('/', PaymentController.getAllPayments);
router.get('/student/:studentId', PaymentController.getStudentPayments);

router.post(
  '/initiate',
  validateRequest(PaymentValidation.createPaymentZodSchema),
  PaymentController.createPayment
);

export const PaymentRoutes = router;