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


export const PaymentService ={
    createPayment,
}