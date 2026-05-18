import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { StudentRoutes } from "../modules/student/student.route.js";
import { ClassRoutes } from "../modules/class/class.route.js";
import { TeacherRoutes } from "../modules/teacher/teacher.route.js";
import { SubjectRoutes } from "../modules/subject/subject.route.js";
import { AttendanceRoutes } from "../modules/attendance/attendance.route.js";
import { ResultRoutes } from "../modules/result/result.route.js";
import { ExamRoutes } from "../modules/exam/exam.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/class",
    route: ClassRoutes,
  },
  {
    path: "/teachers",
    route: TeacherRoutes,
  },
  {
    path: "/subjects",
    route: SubjectRoutes,
  },

  {
    path: "/attendance",
    route: AttendanceRoutes,
  },

  {
    path: "/results",
    route: ResultRoutes,
  },
  {
    path: "/exams",
    route: ExamRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
