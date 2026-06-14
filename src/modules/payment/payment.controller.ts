
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { PaymentService } from "./payment.service.js";
import { prisma } from "../../lib/prisma.js";
import SSLCommerzPayment from "sslcommerz-lts";
import crypto from "crypto";

import { EmailService } from "../email/email.service.js"; 

// SSLCommerz Credentials Configuration
const store_id = process.env.STORE_ID || "testbox";
const store_passwd = process.env.STORE_PASSWORD || "testbox@ssl";
const is_live = process.env.IS_LIVE === "true";

// ১. SSLCommerz Payment Session Initialization
const initiateSSLCommerzPayment = catchAsync(async (req: Request, res: Response) => {
  const { amount, purpose, studentId } = req.body;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    return res
      .status(404)
      .json({ success: false, message: "Student structure not found" });
  }

  let studentEmail = "student@schoolpro.com"; 

  if (student.userId) {
    const userAccount = await prisma.user.findUnique({
      where: { id: student.userId },
    });
    if (userAccount?.email) {
      studentEmail = userAccount.email;
    }
  }

  const transactionId = `TXN-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const backend = process.env.BACKEND_URL || "http://localhost:5000";

  // SSLCommerz Data Layout
  const paymentData = {
    total_amount: Number(amount),
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${backend}/api/v1/payments/success/${transactionId}`,
    fail_url: `${backend}/api/v1/payments/fail/${transactionId}`,
    cancel_url: `${backend}/api/v1/payments/cancel/${transactionId}`,
    ipn_url: `${backend}/api/v1/payments/ipn`,
    shipping_method: "No",
    product_name: purpose || "School Fee",
    product_category: "Education",
    product_profile: "non-physical-goods",
    cus_name: student.name || "Student User",
    cus_email: studentEmail, 
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_city: "N/A",
    ship_country: "N/A",
  };

  await prisma.payment.create({
    data: {
      amount: Number(amount),
      status: "PENDING",
      transactionId,
      purpose,
      studentId,
    },
  });

  console.log("SSL Credentials Check:", store_id, store_passwd, is_live);

  const SSLCZ = (SSLCommerzPayment as any).default || SSLCommerzPayment;
  const sslcz = new SSLCZ(store_id, store_passwd, is_live);

  try {
    const apiResponse = await sslcz.init(paymentData);

    if (apiResponse?.GatewayPageURL) {
      return res.status(200).json({
        success: true,
        url: apiResponse.GatewayPageURL,
      });
    } else {
      console.log("❌ SSLCommerz Gate Rejected:", apiResponse);
      return res.status(400).json({
        success: false,
        message: "Failed to generate SSLCommerz gateway URL token",
        details: apiResponse?.failedreason || apiResponse,
      });
    }
  } catch (sslError: any) {
    console.error("💥 Core SSLCommerz Integration Crash:", sslError);
    return res.status(500).json({
      success: false,
      message: "Internal gateway engine connectivity failure",
      error: sslError?.message || sslError,
    });
  }
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const tranId = (req.body?.tran_id || req.params.tranId) as string;

  if (!tranId) {
    return res.status(400).json({ success: false, message: "Transaction ID parameter is missing" });
  }


  const updatedPayment = await prisma.payment.update({
    where: { transactionId: tranId },
    data: { status: "PAID" },
  });

  if (updatedPayment) {
    const studentData = await prisma.student.findUnique({
      where: { id: updatedPayment.studentId },
    });

    if (studentData) {
      let recipientEmail = "student@schoolpro.com"; 

      if (studentData.userId) {
        const userAccount = await prisma.user.findUnique({
          where: { id: studentData.userId },
        });
        if (userAccount?.email) {
          recipientEmail = userAccount.email;
        }
      }

      EmailService.sendInvoiceWithPDF({
        to: recipientEmail,
        subject: `💳 Payment Receipt Verified - Txn: ${updatedPayment.transactionId}`,
        paymentData: {
          transactionId: updatedPayment.transactionId,
          paymentDate: updatedPayment.paymentDate,
          studentName: studentData.name,
          studentId: updatedPayment.studentId,
          purpose: updatedPayment.purpose,
          amount: updatedPayment.amount,
        },
      }).catch(mailError => {
        console.error("📧 Background Email Dispatch Error:", mailError);
      });
    } else {
      console.warn(`⚠️ Payment ${tranId} succeeded but linked student data not found.`);
    }
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${frontendUrl}/payments?status=success&trx=${tranId}`);
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const tranId = (req.body?.tran_id || req.params.tranId) as string;

  if (!tranId) {
    return res.status(400).json({ success: false, message: "Transaction ID parameter is missing" });
  }

  await prisma.payment.update({
    where: { transactionId: tranId },
    data: { status: "FAILED" },
  });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${frontendUrl}/payments?status=failed`);
});

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPayment(req.body);
  res.status(200).json({
    success: true,
    message: "Payment Created Successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayments();
  res.status(200).json({
    success: true,
    message: "Payments ledger fetched successfully",
    data: result,
  });
});

const getStudentPayments = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.params.studentId as string;

  const result = await PaymentService.getPaymentsByStudent(studentId);
  res.status(200).json({
    success: true,
    message: "Student payments fetched successfully",
    data: result,
  });
});

export const PaymentController = {
  initiateSSLCommerzPayment,
  paymentSuccess,
  paymentFail,
  createPayment,
  getAllPayments,
  getStudentPayments,
};