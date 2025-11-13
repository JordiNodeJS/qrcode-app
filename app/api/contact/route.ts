import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Minimal type for Resend send result to help with logging/returns
interface ResendSendResult {
  id?: string;
  data?: { id?: string } | null;
  [key: string]: unknown;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateFormData = (data: ContactFormData): string | null => {
  if (
    !data.name ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 100
  ) {
    return "Name must be between 2 and 100 characters";
  }

  if (!data.email || !validateEmail(data.email)) {
    return "Invalid email address";
  }

  if (
    !data.subject ||
    data.subject.trim().length < 5 ||
    data.subject.trim().length > 200
  ) {
    return "Subject must be between 5 and 200 characters";
  }

  if (
    !data.message ||
    data.message.trim().length < 10 ||
    data.message.trim().length > 1000
  ) {
    return "Message must be between 10 and 1000 characters";
  }

  return null;
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ContactFormData = await request.json();

    // Log incoming request (useful for debugging). Avoid logging secrets.
    try {
      console.log(
        `[contact] Incoming request at ${new Date().toISOString()}:`,
        JSON.stringify(body)
      );
    } catch {
      console.log("[contact] Incoming request (non-serializable)", body);
    }

    // Validate form data
    const validationError = validateFormData(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Check if API key is configured (don't print the key itself)
    if (!process.env.RESEND_API_KEY) {
      console.error("[contact] RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    } else {
      console.log("[contact] RESEND_API_KEY is configured: YES");
    }

    // Send email using Resend. Wrap in try/catch and log full details for debugging.
    let sendResult: ResendSendResult | null = null;
    try {
      // Allow overriding from/to via environment for testing/production
      const mailFrom =
        process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
      const mailTo = process.env.RESEND_TO_EMAIL
        ? process.env.RESEND_TO_EMAIL.split(",").map((s) => s.trim())
        : ["info@webcode.es"];

      sendResult = await resend.emails.send({
        from: mailFrom,
        to: mailTo,
        subject: `Contact Form: ${body.subject}`,
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 15px; }
              .field-label { font-weight: bold; color: #1f2937; }
              .field-value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; }
              .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="field-label">From:</div>
                  <div class="field-value">${body.name}</div>
                </div>
                <div class="field">
                  <div class="field-label">Email:</div>
                  <div class="field-value"><a href="mailto:${body.email}">${
          body.email
        }</a></div>
                </div>
                <div class="field">
                  <div class="field-label">Subject:</div>
                  <div class="field-value">${body.subject}</div>
                </div>
                <div class="field">
                  <div class="field-label">Message:</div>
                  <div class="field-value">${body.message.replace(
                    /\n/g,
                    "<br>"
                  )}</div>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from the QR Code Generator contact form</p>
                <p>Timestamp: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </body>
        </html>
      `,
        text: `
New Contact Form Submission

From: ${body.name}
Email: ${body.email}
Subject: ${body.subject}

Message:
${body.message}

---
Sent from QR Code Generator
Timestamp: ${new Date().toLocaleString()}
      `.trim(),
      });
    } catch (sendErr) {
      // Log full error object and return a generic error to the client
      console.error(
        "[contact] Resend API threw an error:",
        sendErr instanceof Error ? sendErr.stack || sendErr.message : sendErr
      );
      try {
        // If the error has a response/body, try to log it
        console.error("[contact] Resend error (raw):", JSON.stringify(sendErr));
      } catch {
        // ignore
      }

      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }

    // Log the send result for debugging; this often contains id / status
    try {
      console.log(
        "[contact] Resend send result:",
        JSON.stringify(sendResult, null, 2)
      );
    } catch {
      console.log(
        "[contact] Resend send result (non-serializable):",
        sendResult
      );
    }

    // If Resend returned an error object, surface a helpful error to the client
    type ResendError = {
      message?: string;
      statusCode?: number;
      name?: string;
      [key: string]: unknown;
    };
    const maybeError = (sendResult as unknown as { error?: ResendError })
      ?.error;
    if (maybeError) {
      console.error("[contact] Resend returned error:", maybeError);
      return NextResponse.json(
        {
          error: maybeError.message || "Failed to send email (resend error)",
          details: {
            statusCode: maybeError.statusCode,
            name: maybeError.name,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        id: sendResult?.id ?? sendResult?.data?.id ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
