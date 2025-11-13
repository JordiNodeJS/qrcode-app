"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (text.trim()) {
      generateQRCode(text);
    } else {
      setQrCodeUrl("");
    }
  }, [text]);

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
        width: 300,
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
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
            aria-label="Text input for QR code generation"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{text.length} / 2000 characters</span>
            {text && (
              <button
                onClick={() => setText("")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          )}

          {qrCodeUrl && !loading && (
            <>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                <img
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  className="w-full max-w-[300px] h-auto"
                />
              </div>

              <button
                onClick={downloadQRCode}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                aria-label="Download QR code as PNG image"
              >
                📥 Download QR Code
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
