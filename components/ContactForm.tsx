"use client";

import { useState, FormEvent, useEffect } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [ticket, setTicket] = useState<
    | {
        id: string | null;
        timestamp: string;
        data: FormData;
      }
    | null
  >(null);
  const [copied, setCopied] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "El nombre no debe exceder 100 caracteres";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor, introduce una dirección de correo válida";
    }

    if (formData.subject.trim().length < 5) {
      newErrors.subject = "El asunto debe tener al menos 5 caracteres";
    } else if (formData.subject.trim().length > 200) {
      newErrors.subject = "El asunto no debe exceder 200 caracteres";
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = "El mensaje no debe exceder 1000 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if ((errors as any)[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send message");

      const submitted = { ...formData };
      setSuccess(true);
      setTicket({ id: data?.id ?? null, timestamp: new Date().toISOString(), data: submitted });

      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const handleCopyTicket = async () => {
    if (!ticket) return;
    const text = `ID de ticket: ${ticket.id ?? "-"}\nFecha: ${new Date(ticket.timestamp).toLocaleString()}\n\nNombre: ${ticket.data.name}\nCorreo: ${ticket.data.email}\nAsunto: ${ticket.data.subject}\n\nMensaje:\n${ticket.data.message}`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  const handlePrintTicket = () => {
    if (!ticket) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Ticket ${ticket.id ?? ""}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111} .ticket{max-width:800px;margin:0 auto} .field{margin-bottom:12px} pre{white-space:pre-wrap;background:#f5f5f5;padding:10px;border-radius:4px}</style></head><body><div class="ticket"><h1>Resumen de envío</h1><p><strong>ID de ticket:</strong> ${ticket.id ?? "-"}</p><p><strong>Fecha:</strong> ${new Date(ticket.timestamp).toLocaleString()}</p><div class="field"><strong>Nombre:</strong> ${escapeHtml(ticket.data.name)}</div><div class="field"><strong>Correo:</strong> ${escapeHtml(ticket.data.email)}</div><div class="field"><strong>Asunto:</strong> ${escapeHtml(ticket.data.subject)}</div><div class="field"><strong>Mensaje:</strong><pre>${escapeHtml(ticket.data.message)}</pre></div></div><script>window.onload=function(){window.print();setTimeout(()=>window.close(),750);}</script></body></html>`;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  useEffect(() => {
    const el = document.getElementById(ticket ? "contact-ticket" : "contact-success");
    if (el) setTimeout(() => (el as HTMLElement).focus(), 100);
  }, [ticket, success]);

      return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 id="contact-heading" className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Contacto
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-labelledby="contact-heading" aria-describedby="contact-instructions">
            <p id="contact-instructions" className="sr-only">
              Todos los campos marcados con un asterisco son obligatorios. Responderemos en un plazo de 2 días hábiles.
            </p>

            <fieldset aria-describedby="contact-instructions" className="space-y-6 border-0 p-0 m-0">
              <legend className="sr-only">Contact form</legend>

              {success && !ticket && (
                <div id="contact-success" tabIndex={-1} className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400" role="alert" aria-live="assertive">
                  ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
                </div>
              )}

              {ticket && (
                <div id="contact-ticket" tabIndex={-1} className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100" role="region" aria-labelledby="ticket-heading">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 id="ticket-heading" className="text-lg font-semibold">Resumen de envío</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Guarda este ticket para referencia.</p>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-300 flex flex-col items-end gap-2">
                      <div><span className="font-mono">{ticket.id ?? "-"}</span></div>
                      <div className="text-xs">{new Date(ticket.timestamp).toLocaleString()}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button type="button" onClick={handleCopyTicket} title="Copiar ticket" aria-label="Copiar ticket" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700 inline-flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm" aria-hidden>content_copy</span>
                          <span>Copiar ticket</span>
                        </button>
                        <button type="button" onClick={handlePrintTicket} title="Imprimir ticket" aria-label="Imprimir ticket" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700 inline-flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm" aria-hidden>print</span>
                          <span>Imprimir ticket</span>
                        </button>
                      </div>
                      {copied && <div className="text-xs text-green-600 dark:text-green-400 mt-1">Copiado al portapapeles</div>}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                    <div><strong>Nombre:</strong> <span className="ml-1">{ticket.data.name}</span></div>
                    <div><strong>Correo:</strong> <span className="ml-1">{ticket.data.email}</span></div>
                    <div><strong>Asunto:</strong> <span className="ml-1">{ticket.data.subject}</span></div>
                    <div>
                      <strong>Mensaje:</strong>
                      <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 border rounded text-sm whitespace-pre-wrap">{ticket.data.message}</div>
                    </div>
                  </div>
                </div>
              )}

              {apiError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400" role="alert" aria-live="assertive">
                  {apiError}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre <span aria-hidden className="text-red-500">*</span>
                  <span className="sr-only"> requerido</span>
                </label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} maxLength={100} autoComplete="name" required className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} aria-label="Tu nombre" aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
                {errors.name && <p id="name-error" role="alert" aria-live="assertive" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correo electrónico <span aria-hidden className="text-red-500">*</span>
                  <span className="sr-only"> requerido</span>
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} aria-label="Tu correo electrónico" aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                {errors.email && <p id="email-error" role="alert" aria-live="assertive" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Asunto <span aria-hidden className="text-red-500">*</span>
                  <span className="sr-only"> requerido</span>
                </label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} maxLength={200} autoComplete="on" required className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${errors.subject ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} aria-label="Asunto del correo" aria-required="true" aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "subject-error" : undefined} />
                {errors.subject && <p id="subject-error" role="alert" aria-live="assertive" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje <span aria-hidden className="text-red-500">*</span>
                  <span className="sr-only"> requerido</span>
                </label>
                <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} maxLength={1000} autoComplete="off" required className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`} aria-label="Tu mensaje" aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error message-counter" : "message-counter"} />
                <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span id="message-counter" aria-live="polite">{formData.message.length} / 1000 caracteres</span>
                </div>
                {errors.message && <p id="message-error" role="alert" aria-live="assertive" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" aria-disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2"><span className="material-symbols-outlined">send</span><span>Enviar mensaje</span></span>
                )}
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center"><span aria-hidden>*</span> Campos obligatorios</p>
            </fieldset>
          </form>
        </div>
      );
    }
