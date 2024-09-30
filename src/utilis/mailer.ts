import nodemailer from "nodemailer";
import User from "@/Models/userModel";
import { v4 as uuidv4 } from "uuid"; // Import UUID

// Helper function to construct the email content
const createEmailContent = (token: string, emailType: string) => {
  const baseUrl = process.env.DOMAIN; // Ensure this is defined in your environment
  const action =
    emailType === "VERIFY" ? "verify your email" : "reset your password";
  const link = `${baseUrl}/verifyemail?token=${token}`;

  return {
    subject:
      emailType === "VERIFY" ? "Verify your email" : "Reset your password",
    html: `
      <p>Click <a href="${link}">here</a> to ${action}.</p>
      <p>Or copy and paste the link below into your browser:</p>
      <p>${link}</p>
    `,
  };
};

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET"; // Restrict to specific types
  userId: number;
}) => {
  try {
    // Create a UUID token
    const token = uuidv4();

    // Update the user document based on the email type
    const updateData = {
      verifyToken: emailType === "VERIFY" ? token : undefined,
      verifyTokenExpiry:
        emailType === "VERIFY" ? Date.now() + 3600000 : undefined, // Token valid for 1 hour
      forgotPasswordToken: emailType === "RESET" ? token : undefined,
      forgotPasswordTokenExpiry:
        emailType === "RESET" ? Date.now() + 3600000 : undefined, // Token valid for 1 hour
    };

    await User.findByIdAndUpdate(userId, { $set: updateData });

    // Create email transport
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0beb172942e468",
        pass: "f9c19ae0c2cf2c",
      },
    });

    // Generate email content
    const { subject, html } = createEmailContent(token, emailType);

    // Set up mail options
    const mailOptions = {
      from: "workTime@gmail.com",
      to: email,
      subject,
      html,
    };

    // Send the email
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (e: unknown) {
    const error = e as Error;
    throw new Error(error.message);
  }
};
