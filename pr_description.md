## feat: Add responsive QR generator, download, and robust contact handling

### Resumen
Esta PR introduce un generador de códigos QR responsivo con vista previa en tiempo real y descarga en PNG, además de mejorar y robustecer el flujo del formulario de contacto (validación en servidor, plantilla de correo y comportamiento de mock en desarrollo).

Motivación: facilitar la creación y descarga de códigos QR desde la interfaz y asegurar que el flujo de contacto sea confiable tanto en desarrollo (mock) como en producción con Resend.

Issues relacionados: ninguna referencia automática detectada en esta rama; añade el número de issue si aplica.

### Cambios realizados
- Nuevas funcionalidades:
  - `components/QRGenerator.tsx`: componente cliente con generación de QR usando la librería `qrcode`, ajuste de tamaño responsivo, debounce en resize y descarga en PNG.
  - `app/page.tsx`: integra la sección del generador y CTA hacia `contact` y `about`.
  - `components/ContactForm.tsx`: mejoras en la experiencia del formulario (ticket, copiar/imprimir ticket, validación cliente).

- Correcciones / Robustez:
  - `app/api/contact/route.ts`: validación en servidor, manejo de ausencia de `RESEND_API_KEY` con mock en `development`, logging seguro y mensajes de error claramente definidos para el cliente.
  - `lib/utils.ts`: utilidades de validación y logging seguro para evitar fallos al serializar objetos.

- Refactor:
  - `lib/constants.ts`: centraliza límites y constantes para QR y formulario; mensajes en español consistentes.

- Documentación / metadatos:
  - Revisión de `README.md` y `docs/REFACTORING_SUMMARY.md` según cambios recientes.

- UI/UX:
  - Mejoras en estilos y accesibilidad (atributos `aria-*`, placeholders, estados de carga).

### Detalles técnicos
- Implementación:
  - QR generado en cliente usando `qrcode` y renderizado como Data URL para `next/image` (con `unoptimized`).
  - Tamaño responsivo: cálculo basado en `window.innerWidth * 0.8`, con límites `QR_CODE_MIN_WIDTH` / `QR_CODE_MAX_WIDTH` y debounce para eventos `resize`.
  - Envío de contacto: `app/api/contact/route.ts` valida longitud y email con funciones en `lib/utils.ts`; si `RESEND_API_KEY` existe se envía por Resend, si no y `NODE_ENV === "development"` se crea un mock de envío para pruebas locales.
  - Logging: `safeLog` y `safeLogError` serializan con cuidado para evitar excepciones al loguear objetos no serializables.

- Decisiones arquitectónicas:
  - Mantener validaciones en cliente y servidor y centralizar límites en `lib/constants.ts` para evitar inconsistencias.
  - Dejar comportamiento de mock en desarrollo para permitir pruebas del frontend sin clave de producción.

- Dependencias relevantes:
  - `qrcode` para generación de QR en cliente.
  - `resend` para envío de correos desde la API; requiere `RESEND_API_KEY` para envíos reales.

- Breaking changes:
  - Ninguno esperado; cambios aditivos y conservadores.

### Pruebas
- Pruebas manuales realizadas:
  - Generación de QR con varias longitudes (cadena corta, URL, textos largos hasta límite configurado).
  - Vista previa reactiva y ajuste al redimensionar la ventana (debounce verificado).
  - Descarga de PNG desde el Data URL en navegadores Chromium.
  - Envío de formulario: validación cliente y servidor; en ausencia de `RESEND_API_KEY` en desarrollo se observa mock send y el frontend recibe `id` de ticket.
  - Copiar ticket al portapapeles y función imprimir (genera nueva ventana con contenido escapado).

- Casos de prueba cubiertos:
  - Datos válidos → retorno 200 con `id`.
  - Campos inválidos o vacíos → 400 con error legible.
  - Simular fallo en Resend → 500 con mensaje genérico al cliente.

### Notas de despliegue
- Variables de entorno necesarias para envíos reales:
  - `RESEND_API_KEY` (requerido en producción)
  - `RESEND_FROM_EMAIL` (opcional, por defecto `onboarding@resend.dev`)
  - `RESEND_TO_EMAIL` (opcional, lista separada por comas; por defecto `info@webcode.es`)

- Pasos:
  - Asegurar `RESEND_API_KEY` en el entorno antes de desplegar.
  - No se requieren migraciones de base de datos.
  - Instalar dependencias: `pnpm install`.

### Puntos para revisar por el revisor
- Revisa la plantilla HTML del correo en `app/api/contact/route.ts` (contenido y codificación).
- Revisar sanitización: `escapeHtml` se usa en impresión de ticket; confirmar que no hay vectores XSS en otras salidas.
- Performance: comprobar generación de imágenes grandes en dispositivos móviles; `QR_CODE_MAX_WIDTH` está en 600px.
- Accesibilidad: revisar etiquetas `aria-*` y orden de tabulación en `ContactForm` y `QRGenerator`.

---

Archivo generado y normalizado en UTF-8.
