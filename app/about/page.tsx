import Link from "next/link";

export const metadata = {
  title: "About - QR Code Generator",
  description: "Learn more about the QR Code Generator project and team.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
            About Us
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
            This project provides a fast and user-friendly way to generate QR
            codes from text or URLs. Built with Next.js 15, TypeScript and
            Tailwind CSS, it demonstrates modern App Router patterns and
            component-driven design.
          </p>
        </div>

        <section className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Mission</h2>
          <p>
            Our mission is to make QR code generation simple and accessible —
            whether you're sharing a URL, contact info, or any text, generate a
            downloadable QR code in seconds.
          </p>

          <h2>Contact</h2>
          <p>
            For support or inquiries, visit our{" "}
            <Link href="/contact">Contact</Link> page.
          </p>

          <h2>Technology</h2>
          <ul>
            <li>Next.js 15 (App Router)</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>qrcode library for generation</li>
          </ul>
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
