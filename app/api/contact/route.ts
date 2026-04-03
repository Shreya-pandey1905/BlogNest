import { NextRequest } from "next/server";
import { sendContactEmail } from "@/lib/mailer";
import { okResponse, errorResponse } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    if (!firstName?.trim() || !email?.trim() || !message?.trim()) {
      return errorResponse("First name, email, and message are required.", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse("Please provide a valid email address.", 400);
    }

    if (message.trim().length < 10) {
      return errorResponse("Message must be at least 10 characters.", 400);
    }

    await sendContactEmail({
      firstName: firstName.trim(),
      lastName: (lastName ?? "").trim(),
      senderEmail: email.trim().toLowerCase(),
      message: message.trim(),
    });

    return okResponse({ message: "Your message has been sent successfully!" }, 200);
  } catch (err) {
    console.error("Contact form error:", err);
    return errorResponse("Failed to send message. Please try again.", 500);
  }
}
