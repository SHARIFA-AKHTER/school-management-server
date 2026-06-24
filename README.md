# 🎓 School Management System (Backend)

A robust and scalable backend for a School Management System built with **Node.js**, **Express.js**, and **Prisma ORM**. This system manages students, teachers, classes, attendance, and academic results with role-based access control.

---

## 🚀 Key Features

*   **Authentication & Authorization:** Secure login system using JWT with role-based access control (Admin, Teacher, Student).
*   **Student Management:** Complete CRUD operations for managing student profiles and enrollment.
*   **Teacher Management:** Directory for managing teaching staff records.
*   **Attendance Tracking:** Daily attendance marking system for students with date-wise records.
*   **Result Management:** Subject-wise marks entry and automated result retrieval for students.
*   **Relational Database:** Optimized PostgreSQL schema with complex relations handled via Prisma ORM.
*   **Data Validation:** Strict schema validation for all incoming requests using Zod.

---

## 🛠 Tech Stack

*   **Language:** TypeScript
*   **Framework:** Express.js
*   **ORM:** Prisma
*   **Database:** PostgreSQL
*   **Validation:** Zod
*   **Security:** JWT (JSON Web Token), Bcrypt (Password Hashing)

---

## 🛠 Setup Instructions

Follow these steps to get the project running on your local machine:

### 1. Clone the Repository
```bash
git clone [https://github.com/SHARIFA-AKHTER/school-management-server.git]
cd school-management-server

📡 API Endpoints (Quick Reference)MethodEndpointDescriptionPOST/api/v1/auth/loginUser authenticationPOST/api/v1/students/create-studentRegister a new studentPOST/api/v1/attendances/take-attendanceRecord daily attendanceGET/api/v1/results/:studentIdFetch results for a specific studentGET/api/v1/attendancesList all student attendance records
Live Demo: [https://school-management-server-iksg.vercel.app]