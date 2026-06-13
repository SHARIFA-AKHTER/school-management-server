import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { EmailStatus, EmailType } from '@prisma/client';
import { ISendEmailInput } from './email.interface.js'; 
import { prisma } from '../../lib/prisma.js';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInvoiceWithPDF = async (payload: ISendEmailInput): Promise<boolean> => {
  const { to, subject, paymentData } = payload;
  
  let emailLogId = '';

 
  try {
    const log = await prisma.emailLog.create({
      data: {
        recipient: to,
        subject,
        emailType: EmailType.PAYMENT_INVOICE,
        status: EmailStatus.PENDING,
       
      },
    });
    emailLogId = log.id;
  } catch (dbError) {
    console.error('❌ Failed to initialize email log in DB:', dbError);
  }

  try {
    
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // --- PDF Template Design ---

      doc.fillColor('#4F46E5').fontSize(26).text('SCHOOLPRO MATRIX', { align: 'center' }).moveDown();
      doc.fillColor('#1F2937').fontSize(18).text('OFFICIAL PAYMENT RECEIPT', { align: 'center' }).moveDown(1.5);
      
      doc.moveTo(50, 140).lineTo(545, 140).stroke('#E5E7EB').moveDown(2);

      doc.fillColor('#4B5563').fontSize(11);
      doc.text(`Transaction ID: `, { continued: true }).fillColor('#111827').text(paymentData.transactionId);
      doc.fillColor('#4B5563').text(`Billing Date: `, { continued: true }).fillColor('#111827').text(new Date(paymentData.paymentDate || new Date()).toLocaleString('en-GB'));
      doc.fillColor('#4B5563').text(`Student Name: `, { continued: true }).fillColor('#111827').text(paymentData.studentName);
      doc.fillColor('#4B5563').text(`Student UUID: `, { continued: true }).fillColor('#111827').text(paymentData.studentId).moveDown(2);

      // Table Header Block
      doc.fillColor('#F9FAFB').rect(50, 240, 495, 30).fill().stroke('#E5E7EB');
      doc.fillColor('#374151').fontSize(12).text('Description / Purpose', 60, 248);
  
      doc.text('Amount Cost', 440, 248, { width: 90, align: 'right' });

      // Table Row Content
      doc.fillColor('#111827').fontSize(11).text(paymentData.purpose, 60, 290);
      doc.text(`${paymentData.amount.toFixed(2)} BDT`, 440, 290, { width: 90, align: 'right' });

      doc.moveTo(50, 320).lineTo(545, 320).stroke('#F3F4F6');

      // Total Calculation Section
      doc.fillColor('#4B5563').fontSize(12).text('Total Paid Amount:', 320, 350, { width: 110, align: 'right' });
      doc.fillColor('#4F46E5').fontSize(16).text(`${paymentData.amount} BDT`, 440, 347, { width: 90, align: 'right' });

      // Footer
      doc.fillColor('#9CA3AF').fontSize(9).text('This is a system-generated secure digital invoice natively tracked via SSLCommerz matrix logs protocols. No physical signature required.', 50, 700, { width: 495, align: 'center' });

      doc.end();
    });

    const mailOptions = {
      from: `"SchoolPro Automation" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: `Hello, Your institutional transactional invoice for "${paymentData.purpose}" valued at ${paymentData.amount} BDT has been successfully processed. Please download the attached official invoice PDF.`,
      attachments: [
        {
          filename: `Invoice-${paymentData.transactionId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    const isSuccess = !!info.messageId;

    if (isSuccess && emailLogId) {
      await prisma.emailLog.update({
        where: { id: emailLogId },
        data: { status: EmailStatus.SENT },
      });
    }

    return isSuccess;

  } catch (error: any) {
    console.error('❌ Email Automation Flow Error:', error);

    if (emailLogId) {
      await prisma.emailLog.update({
        where: { id: emailLogId },
        data: {
          status: EmailStatus.FAILED,
          errorMessage: error.message || 'Unknown SMTP / PDF Handshake Exception',
        },
      });
    }

    return false;
  }
};

export const EmailService = {
  sendInvoiceWithPDF,
};