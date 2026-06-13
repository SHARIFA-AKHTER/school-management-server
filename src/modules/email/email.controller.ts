import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import { EmailService } from './email.service.js';


const triggerInvoiceEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await EmailService.sendInvoiceWithPDF({
    to: req.body.to,
    subject: `💳 Payment Receipt Verified - Txn: ${req.body.paymentData.transactionId}`,
    paymentData: req.body.paymentData,
  });

  res.status(200).json({
    success: true,
    message: 'Automated digital PDF invoice dispatched successfully via SMTP server without DB footprint',
    data: result,
  });
});

export const EmailController = {
  triggerInvoiceEmail,
};