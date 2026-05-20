import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync.js"
import { PaymentService } from "./payment.service.js"

const createPayment = catchAsync(async( req: Request,res: Response)=>{
    const result = await PaymentService.createPayment(req.body)
    res.status(200).json({
        success: true,
        message: 'Payment Created Successfully',
        data: result,
    });
});

const getAllPayments = catchAsync(async(req: Request, res: Response)=>{
    const result = await PaymentService.getAllPayments()
    res.status(200).json({
        success: true,
        message: 'Payments ledger fetched successfully',
        data: result,
    })
})

const getStudentPayments = catchAsync(async(req: Request, res: Response)=>{
    const studentId = req.params.studentId as string;

    const result = await PaymentService.getPaymentsByStudent(studentId)
    res.status(200).json({
        success: true,
        message: 'Student payments fetched successfully',
        data: result,
    })
})

export const PaymentController = {
    createPayment,
    getAllPayments,
    getStudentPayments
}
