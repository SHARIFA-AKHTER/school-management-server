export interface IPayment {
    amount: number;
    status: 'PENDING' | 'PAID' | 'FAILED';
    transactionId: string;
    purpose: string;
    studentId: string;
}