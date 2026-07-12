import { prisma } from "../../lib/prisma.js";
import { IResult } from "./result.interface.js";

const createResult = async (data: IResult) => {
  const result = await prisma.result.create({
    data: {
      studentId: data.studentId,
      subjectId: data.subjectId ?? '', 
      marks: Number(data.marks),
      examId: data.examId || null,
    },
    include: {
      student: true,
      subject: true,
      exam: true,
    },
  });
  return result;
};

const getStudentResults = async (studentId: string) => {
  const result = await prisma.result.findMany({
    where: { studentId },
    include: {
      student: {
        select: { name: true, classId: true }
      }
    }
  });
  return result;
};

const getAllResults = async () => {
  return await prisma.result.findMany({
    include: {
      student: true,
      subject: true,
      exam: true,
    },
  });
};

export const ResultService = {
  createResult,
  getStudentResults,
  getAllResults,
};