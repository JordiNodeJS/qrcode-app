"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import Image from "next/image";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrWidth, setQrWidth] = useState<number>(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resizeTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (text.trim()) {
      generateQRCode(text);
    } else {
      setQrCodeUrl("");
    }
  }, [text, qrWidth]);

  // Set QR width based on viewport (responsive) and listen for resize
  useEffect(() => {
    function updateWidth() {
      try {
        const vw = Math.max(120, Math.floor(window.innerWidth * 0.8));
        // Cap the generated QR size for performance
        const size = Math.min(600, vw);
        setQrWidth(size);
      } catch (e) {
        setQrWidth(300);
      }
    }

    updateWidth();

    function onResize() {
      if (resizeTimeout.current) {
        window.clearTimeout(resizeTimeout.current);
      }
      // Debounce resize events
      resizeTimeout.current = window.setTimeout(() => {
        updateWidth();
      }, 150);
    }

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimeout.current) {
        window.clearTimeout(resizeTimeout.current);
      }
    };
  }, []);

  const generateQRCode = async (value: string) => {
    if (!value.trim()) {
      setQrCodeUrl("");
      setError("");
      return;
    }

    if (value.length > 2000) {
      setError("Text is too long. Maximum 2000 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const url = await QRCode.toDataURL(value, {
        errorCorrectionLevel: "M",
        width: qrWidth,
        margin: 4,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCodeUrl(url);
    } catch (err) {
      setError("Failed to generate QR code. Please try again.");
      console.error("QR Code generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        QR Code Generator
      </h2>

      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label
            htmlFor="qr-text"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Enter text or URL
          </label>
          <textarea
            id="qr-text"
            rows={4}
            maxLength={2000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text, URL, or any content to generate QR code..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
            aria-label="Text input for QR code generation"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{text.length} / 2000 characters</span>
            {text && (
              <button
                onClick={() => setText("")}
                className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* QR Code Preview */}
        <div className="flex flex-col items-center space-y-4">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 dark:border-sky-400"></div>
            </div>
          )}

          {qrCodeUrl && !loading && (
            <>
              <div
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                style={{ width: `min(90vw, ${qrWidth}px)` }}
              >
                <Image
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  width={qrWidth}
                  height={qrWidth}
                  unoptimized
                  className="w-full h-auto"
                />
              </div>

              <button
                onClick={downloadQRCode}
                className="w-full sm:w-auto px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                aria-label="Download QR code as PNG image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1 mr-3 h-5 w-5 inline-block"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M3 14.5V17a1 1 0 001 1h12a1 1 0 001-1v-2.5a1 1 0 00-1-1H4a1 1 0 00-1 1z" />
                  <path
                    d="M7 9l3-3 3 3M10 6v8"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                Download QR Code
              </button>
            </>
          )}

          {!qrCodeUrl && !loading && !error && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <svg
                className="mx-auto h-24 w-24 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              <p className="text-lg">Enter text above to generate a QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
