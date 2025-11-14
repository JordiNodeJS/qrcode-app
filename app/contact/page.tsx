import ContactForm from "@/components/ContactForm";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";

export const metadata = {
  title: "Contacto - Generador de códigos QR",
  description: "Ponte en contacto con el equipo del Generador de códigos QR.",
};

export default function ContactPage() {
  return (
    <PageLayout className="py-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Contacto
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Nos encantaría saber de ti — preguntas, comentarios o consultas de
            colaboración son bienvenidas.
          </p>
        </div>

        <ContactForm />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-sky-600 dark:text-sky-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </PageLayout>
  );
}
