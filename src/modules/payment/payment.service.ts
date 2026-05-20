import { prisma } from "../../lib/prisma.js";
import { IPayment } from "./payment.interface.js";

const createPayment = async(data: IPayment)=>{
    const result = await prisma.payment.create({
        data,
        include: {
            student: true,
        }
    })
    return result;
}

const getAllPayments = async()=>{
    const result = await prisma.payment.findMany({
        include: {
            student: true,
        },
        orderBy: {
            paymentDate: 'desc'
        }
    })
    return result;
}

const getPaymentsByStudent = async(studentId: string)=>{
    const result = await prisma.payment.findMany({
        where: { studentId},
        orderBy: { paymentDate: 'desc'},

    })
    return result;
}


export const PaymentService ={
    createPayment,
    getAllPayments,
    getPaymentsByStudent
}

