import QRGenerator from "@/components/QRGenerator";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            QR Code Generator
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Create QR codes instantly and get in touch with us
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {/* QR Generator Section */}
          <section id="qr-generator">
            <QRGenerator />
          </section>

          {/* Divider */}
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-500 text-sm">
                Or contact us
              </span>
            </div>
          </div>

          {/* Contact Form Section */}
          <section id="contact">
            <ContactForm />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} QR Code Generator. All rights
              reserved.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Built with Next.js 15 and ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
