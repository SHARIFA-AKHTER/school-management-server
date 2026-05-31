import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { PaymentService } from "./payment.service.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma.js";
import SSLCommerzPayment from "sslcommerz-lts";
import crypto from "crypto";

// SSLCommerz Credentials Configuration
const store_id = process.env.STORE_ID || "testbox";
const store_passwd = process.env.STORE_PASSWORD || "testbox@ssl";
const is_live = process.env.IS_LIVE === "true";

// ১. SSLCommerz Payment Session Initialization
const initiateSSLCommerzPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { amount, purpose, studentId } = req.body.body;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student structure not found" });
    }

    const transactionId = `TXN-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const paymentData = {
      total_amount: Number(amount),
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.BACKEND_URL}/api/payments/success/${transactionId}`,
      fail_url: `${process.env.BACKEND_URL}/api/payments/fail/${transactionId}`,
      cancel_url: `${process.env.BACKEND_URL}/api/payments/cancel/${transactionId}`,
      ipn_url: `${process.env.BACKEND_URL}/api/payments/ipn`,
      shipping_method: "No",
      product_name: purpose,
      product_category: "Education",
      product_profile: "non-physical-goods",
      cus_name: student.name || "Student User",
      cus_email: "student@schoolpro.com",
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

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(paymentData).then((apiResponse: any) => {
      if (apiResponse?.GatewayPageURL) {
        res.status(200).json({
          success: true,
          url: apiResponse.GatewayPageURL,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Failed to generate SSLCommerz gateway URL token",
        });
      }
    });
  },
);
const paymentSuccess = catchAsync(async (req: Request, res: Response) => {

  const tranId = (req.body?.tran_id || req.params.tranId) as string;

  if (!tranId) {
    return res.status(400).json({ success: false, message: "Transaction ID parameter is missing" });
  }

  await prisma.payment.update({
    where: { transactionId: tranId },
    data: { status: "PAID" },
  });

  res.redirect(`${process.env.FRONTEND_URL}/payments?status=success&trx=${tranId}`);
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

  res.redirect(`${process.env.FRONTEND_URL}/payments?status=failed`);
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
