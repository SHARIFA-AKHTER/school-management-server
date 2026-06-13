export interface IResult {
  id?: string;
  studentId: string;
  subjectId: string;
  subject?: string;
  marks: number;
  examId?: string | null;
}