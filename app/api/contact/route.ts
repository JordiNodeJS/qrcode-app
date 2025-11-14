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
    return "El nombre debe tener entre 2 y 100 caracteres";
  }

  if (!data.email || !validateEmail(data.email)) {
    return "Dirección de correo inválida";
  }

  if (
    !data.subject ||
    data.subject.trim().length < 5 ||
    data.subject.trim().length > 200
  ) {
    return "El asunto debe tener entre 5 y 200 caracteres";
  }

  if (
    !data.message ||
    data.message.trim().length < 10 ||
    data.message.trim().length > 1000
  ) {
    return "El mensaje debe tener entre 10 y 1000 caracteres";
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
    } catch (err) {
      console.log("[contact] Incoming request (non-serializable)", body);
    }

    // Validate form data
    const validationError = validateFormData(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Check if API key is configured (don't print the key itself)
    let useMockSend = false;
    if (!process.env.RESEND_API_KEY) {
      if (process.env.NODE_ENV === "development") {
        // Allow a local mock when developing so front-end behavior can be tested
        useMockSend = true;
        console.log(
          "[contact] RESEND_API_KEY not configured: using mock send in development"
        );
      } else {
        console.error("[contact] RESEND_API_KEY is not configured");
        return NextResponse.json(
          { error: "Email service is not configured" },
          { status: 500 }
        );
      }
    } else {
      console.log("[contact] RESEND_API_KEY is configured: YES");
    }

    // Send email using Resend. Wrap in try/catch and log full details for debugging.
    let sendResult: ResendSendResult | null = null;
    try {
      if (useMockSend) {
        // Create a fake send result for development testing
        sendResult = {
          id: `local-${Date.now()}`,
          data: { id: `local-${Date.now()}` },
        };
        console.log("[contact] Mock send result:", sendResult);
      } else {
        // Allow overriding from/to via environment for testing/production
        const mailFrom =
          process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
        const mailTo = process.env.RESEND_TO_EMAIL
          ? process.env.RESEND_TO_EMAIL.split(",").map((s) => s.trim())
          : ["info@webcode.es"];

        sendResult = await resend.emails.send({
          from: mailFrom,
          to: mailTo,
          subject: `Formulario de contacto: ${body.subject}`,
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
                <h2 style="margin: 0;">Nueva solicitud de contacto</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="field-label">De:</div>
                  <div class="field-value">${body.name}</div>
                </div>
                <div class="field">
                  <div class="field-label">Correo:</div>
                  <div class="field-value"><a href="mailto:${body.email}">${
            body.email
          }</a></div>
                </div>
                <div class="field">
                  <div class="field-label">Asunto:</div>
                  <div class="field-value">${body.subject}</div>
                </div>
                <div class="field">
                  <div class="field-label">Mensaje:</div>
                  <div class="field-value">${body.message.replace(
                    /\n/g,
                    "<br>"
                  )}</div>
                </div>
              </div>
              <div class="footer">
                <p>Este correo fue enviado desde el formulario de contacto del Generador de códigos QR</p>
                <p>Fecha: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </body>
        </html>
      `,
          text: `
Nueva solicitud de contacto

De: ${body.name}
Correo: ${body.email}
Asunto: ${body.subject}

Mensaje:
${body.message}

---
Enviado desde Generador de códigos QR
Fecha: ${new Date().toLocaleString()}
      `.trim(),
        });
      }
    } catch (sendErr) {
      // Log full error object and return a generic error to the client
      console.error(
        "[contact] Resend API threw an error:",
        sendErr instanceof Error ? sendErr.stack || sendErr.message : sendErr
      );
      try {
        // If the error has a response/body, try to log it
        console.error("[contact] Resend error (raw):", JSON.stringify(sendErr));
      } catch (err) {
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
    } catch (err) {
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
        message: "Correo enviado con éxito",
        id: sendResult?.id ?? sendResult?.data?.id ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
