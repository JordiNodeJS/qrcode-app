"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
type Ticket = { id: string; timestamp: number; data: FormData };

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [copied, setCopied] = useState(false);
  const [persistCopyTooltip, setPersistCopyTooltip] = useState(false);
  const [persistPrintTooltip, setPersistPrintTooltip] = useState(false);

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      const copyBtn = document.getElementById("copy-ticket-btn");
      const printBtn = document.getElementById("print-ticket-btn");
      if (persistCopyTooltip && copyBtn && !copyBtn.contains(target))
        setPersistCopyTooltip(false);
      if (persistPrintTooltip && printBtn && !printBtn.contains(target))
        setPersistPrintTooltip(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [persistCopyTooltip, persistPrintTooltip]);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function validateForm(): boolean {
    const next: Partial<FormData> = {};
    if (!formData.name.trim()) next.name = "Required";
    if (!formData.email.trim()) next.email = "Required";
    else if (!validateEmail(formData.email)) next.email = "Invalid email";
    if (!formData.subject.trim()) next.subject = "Required";
    if (!formData.message.trim()) next.message = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Server error");
      const id = json?.id ?? `local-${Date.now()}`;
      setTicket({ id, timestamp: Date.now(), data: formData });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setTicket({
        id: `error-${Date.now()}`,
        timestamp: Date.now(),
        data: formData,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyTicket() {
    if (!ticket) return;
    const text = `Ticket: ${ticket.id}\nDate: ${new Date(
      ticket.timestamp
    ).toLocaleString()}\nName: ${ticket.data.name}\nEmail: ${
      ticket.data.email
    }\nSubject: ${ticket.data.subject}\nMessage:\n${ticket.data.message}`;
    try {
      if (navigator.clipboard?.writeText)
        await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("copy failed", e);
    }
    setPersistCopyTooltip(false);
  }

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function handlePrintTicket() {
    if (!ticket) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Ticket ${escapeHtml(
      ticket.id
    )}</title><meta name="viewport" content="width=device-width,initial-scale=1" /><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:20px;color:#111} pre{white-space:pre-wrap}</style></head><body><h1>Submission summary</h1><div><strong>Ticket:</strong> ${escapeHtml(
      ticket.id
    )}</div><div><strong>Date:</strong> ${escapeHtml(
      new Date(ticket.timestamp).toLocaleString()
    )}</div><div><strong>Name:</strong> ${escapeHtml(
      ticket.data.name
    )}</div><div><strong>Email:</strong> ${escapeHtml(
      ticket.data.email
    )}</div><div><strong>Subject:</strong> ${escapeHtml(
      ticket.data.subject
    )}</div><hr/><pre>${escapeHtml(
      ticket.data.message
    )}</pre><script>window.print();</script></body></html>`;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    }
    setPersistPrintTooltip(false);
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Contact</h2>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.name && (
            <div className="text-xs text-red-600 mt-1">{errors.name}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && (
            <div className="text-xs text-red-600 mt-1">{errors.email}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.subject && (
            <div className="text-xs text-red-600 mt-1">{errors.subject}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded px-3 py-2"
          />
          {errors.message && (
            <div className="text-xs text-red-600 mt-1">{errors.message}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
          {ticket && (
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-600 font-mono">{ticket.id}</div>
              <button
                id="copy-ticket-btn"
                type="button"
                onClick={() => {
                  if (persistCopyTooltip) {
                    handleCopyTicket();
                    return;
                  }
                  setPersistCopyTooltip(true);
                }}
                className="relative group px-3 py-1 bg-gray-100 rounded text-sm inline-flex items-center gap-1"
                aria-label="Copy ticket"
              >
                <span className="material-symbols-outlined text-sm">
                  content_copy
                </span>
                <span>Copy</span>
                <span
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-800 text-white text-xs px-2 py-1 transition-all ${
                    persistCopyTooltip
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                  }`}
                >
                  Copy ticket
                </span>
              </button>
              <button
                id="print-ticket-btn"
                type="button"
                onClick={() => {
                  if (persistPrintTooltip) {
                    handlePrintTicket();
                    return;
                  }
                  setPersistPrintTooltip(true);
                }}
                className="relative group px-3 py-1 bg-gray-100 rounded text-sm inline-flex items-center gap-1"
                aria-label="Print ticket"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print</span>
                <span
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-800 text-white text-xs px-2 py-1 transition-all ${
                    persistPrintTooltip
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                  }`}
                >
                  Print ticket
                </span>
              </button>
            </div>
          )}
        </div>
      </form>

      {ticket && (
        <div
          id="contact-ticket"
          tabIndex={-1}
          className="mt-4 p-4 bg-white dark:bg-gray-900 border rounded"
        >
          <h3 className="font-semibold">Submission summary</h3>
          <div className="text-xs text-gray-500 mb-2">
            {new Date(ticket.timestamp).toLocaleString()}
          </div>
          <div className="text-sm">
            <div>
              <strong>Name:</strong> {ticket.data.name}
            </div>
            <div>
              <strong>Email:</strong> {ticket.data.email}
            </div>
            <div>
              <strong>Subject:</strong> {ticket.data.subject}
            </div>
            <div className="mt-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
              {ticket.data.message}
            </div>
          </div>
          {copied && (
            <div className="text-xs text-green-600 mt-2">
              Copied to clipboard
            </div>
          )}
        </div>
      )}
    </div>
  );
}
