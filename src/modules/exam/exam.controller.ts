import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { ExamService } from "./exam.service.js";

const createExam = catchAsync(async(req: Request, res: Response) => {
    const result = await ExamService.createExam(req.body)
    res.status(200).json({
        success:true,
        message:'Exam created successfully!',
        data:result
    })
})

const getAllExams = catchAsync(async(req: Request, res: Response) => {
    const result = await ExamService.getAllExam()
    res.status(200).json({
        success:true,
        message:'Exams retrieved successfully!',
        data:result
    })
})

const getSingleExam = catchAsync(async(req: Request, res: Response) => {
   const id = req.params.id;
   if(!id || Array.isArray(id)){
    throw new Error('Invalid exam id');
   }
   const result = await ExamService.getSingleExam(id)

    res.status(200).json({
        success:true,
        message:'Exam retrieved successfully!',
        data:result
    })
})

export const ExamController = {
    createExam,
    getAllExams,
    getSingleExam
}
