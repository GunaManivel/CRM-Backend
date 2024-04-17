import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  secure: false,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PWD,
  },
});

export async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log("Email server is ready to take our messages");
  } catch (error) {
    console.error("Error verifying email server:", error);
  }
}

export default transporter;
