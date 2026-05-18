import { prisma } from "../../lib/prisma.js"
import { IExamRequest } from "./exam.interface.js"

 const createExam = async(data: IExamRequest)=>{
    const result = await prisma.exam.create({
        data:{
            ...data,
            examDate:new Date(data.examDate)
        }
    })
    return result
 }

const getAllExam = async() =>{
    const result = await prisma.exam.findMany({
        include:{
            results: true
        },
        orderBy:{
            examDate: 'asc'
        }
    })
    return result;
}
const getSingleExam= async(id: string) =>{
    const result = await prisma.exam.findUnique({
        where:{ id },
        include:{
            results: true,
        },
       
    })
    return result;
}



 export const ExamService = {
    createExam,
    getAllExam,
    getSingleExam
 }