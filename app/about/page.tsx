import Link from "next/link";

export const metadata = {
  title: "Acerca - Generador de Códigos QR",
  description:
    "Conoce más sobre el proyecto Generador de Códigos QR y el equipo.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
            Acerca de este proyecto
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Un generador de códigos QR rápido y accesible. Crea, personaliza y
            descarga tus códigos QR en segundos — ideal para enlaces, contactos
            y más.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none"
            >
              ✉️ Contacto
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              ← Inicio
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
            <div className="text-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.344l1.172-1.172a4 4 0 115.656 5.656L10 19.828 3.172 13a4 4 0 010-5.656z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Misión
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              Simplificar la generación de códigos QR: rápido, fiable y
              accesible para cualquier persona o equipo.
            </p>
          </article>

          <article className="p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
            <div className="text-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <path d="M12 12v9" />
                <path d="M8 3.13a4 4 0 0 0 0 7.75" />
                <path d="M3 8h18" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Tecnología
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              Construido con las siguientes versiones principales (ver
              <code className="mx-1">package.json</code>):
            </p>
            <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li>Next.js 16.0.3</li>
              <li>React 19.2.0</li>
              <li>TypeScript 5.x</li>
              <li>Tailwind CSS 4.x</li>
              <li>`qrcode` 1.5.4</li>
              <li>`resend` 6.4.2</li>
            </ul>
          </article>

          <article className="p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
            <div className="text-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Contacto
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              ¿Tienes sugerencias o problemas? Escríbenos desde la página de
              <Link
                href="/contact"
                className="ml-1 text-sky-600 dark:text-sky-400 hover:underline"
              >
                contacto
              </Link>
              .
            </p>
          </article>
        </section>

        <section className="mt-10 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            ¿Por qué usar este generador?
          </h2>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
            <li>⚡ Generación instantánea y descarga fácil</li>
            <li>🎨 Opciones para texto y URL</li>
            <li>
              🔒 No se almacenan datos en el servidor (según configuración)
            </li>
            <li>✅ Compatibilidad con la mayoría de lectores QR</li>
          </ul>
        </section>

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Generador de Códigos QR — Hecho con ❤️
        </footer>
      </main>
    </div>
  );
}
