import express from 'express';
import { EmailController } from './email.controller.js';
import { EmailValidation } from './email.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';

const router = express.Router();

router.post(
  '/send-invoice',
  validateRequest(EmailValidation.sendInvoiceEmailZodSchema),
  EmailController.triggerInvoiceEmail
);

export const EmailRoutes = router;