export interface IPaymentInvoiceData {
  transactionId: string;
  amount: number;
  purpose: string;
  studentId: string;
  studentName: string;
  paymentDate?: Date;
}

export interface ISendEmailInput {
  to: string;
  subject: string;
  paymentData: IPaymentInvoiceData;
}