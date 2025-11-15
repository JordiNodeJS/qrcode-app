import QRGenerator from "@/components/QRGenerator";
import PageLayout from "@/components/PageLayout";
import Button from "@/components/Button";

export default function Home() {
  return (
    <PageLayout>
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                QR Code Generator
              </h1>
              <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
                Create QR codes instantly and get in touch with us
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {/* QR Generator Section */}
          <section id="qr-generator">
            <QRGenerator />
          </section>

          {/* Quick Links */}
          <section id="contact-cta" className="text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Need help or have questions?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You can reach out to us via the contact page or learn more about
                the project on our About page.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button href="/contact" variant="primary">
                  Contact Us
                </Button>
                <Button href="/about" variant="secondary">
                  Learn More
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 dark:bg-gray-950 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} QR Code Generator. All rights
              reserved.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Built with Next.js 16 and ❤️
            </p>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
}
