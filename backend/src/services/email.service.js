import { createTransport } from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailInfo = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      text,
      html,
    };

    const details = await transporter.sendMail(mailInfo);

  } catch (err) {
    console.log("Error :", err);
  }
};

export async function sendVerificationEmail(user) {
  const emailVerificationToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: user.email,
    subject: "Welcome to PandaAI",
    html: `
            <h1>Welcome ${user.username} to PandaAI</h1>
            <p>We are glad to have you on board</p>
            <p>Please Click the link below to verify your email</p>
            <a href="http://localhost:3000/api/auth/verifyEmail/${emailVerificationToken}">Verify Email</a>
            <p>If you did not sign up for this account, please ignore this email.</p>
                  `,
  });
}
