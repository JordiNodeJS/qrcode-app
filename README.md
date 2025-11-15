# QR Code Generator with Contact Form

[A modern, responsive web application built with Next.js 16 that allows users to generate QR codes from text and includes an integrated contact form powered by Resend API.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## 🌟 Features

- ✨ **QR Code Generation**: Create QR codes from any text input in real-time
- 📥 **Download Functionality**: Save generated QR codes as PNG images
- 📧 **Contact Form**: Integrated email contact form using Resend API
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ⚡ **Fast Performance**: Built with Next.js 16 App Router and Server Components
- 🎨 **Modern UI**: Clean interface built with Tailwind CSS
- ♿ **Accessible**: WCAG 2.1 Level AA compliant

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- pnpm (recommended) or npm
- Resend API key ([Get one here](https://resend.com))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/qrcode-app.git
cd qrcode-app
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

4. **Run the development server**

```bash
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## 🏗️ Project Structure

```
qrcode-app/
├── .github/
│   ├── copilot-instructions.md    # GitHub Copilot coding guidelines
│   └── prompts/
│       └── pr.prompt.md           # Pull request template
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts           # Contact form API endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/
│   ├── QRGenerator.tsx            # QR code generator component
│   └── ContactForm.tsx            # Contact form component
├── lib/
│   └── utils.ts                   # Utility functions
├── docs/
│   ├── specification.md           # Project specification
│   └── tasks.md                   # Task tracking
├── public/                        # Static assets
├── .env.local                     # Environment variables (create this)
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies
├── README.md                      # This file
└── LICENSE                        # MIT License
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required
RESEND_API_KEY=re_your_api_key_here

# Optional
NODE_ENV=development
```

⚠️ **Important**: Never commit `.env.local` to version control!

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Create an API key in your dashboard
3. Add the API key to `.env.local`
4. Emails will be sent to: info@webcode.es

## 💻 Usage

### QR Code Generator

1. Navigate to the home page
2. Enter text in the input field (up to 2000 characters)
3. View the real-time QR code preview
4. Click "Download QR Code" to save as PNG
5. The downloaded file will include a timestamp

### Contact Form

1. Scroll to the contact form section
2. Fill in all required fields:
   - Name (2-100 characters)
   - Email (valid email format)
   - Subject (5-200 characters)
   - Message (10-1000 characters)
3. Click "Send Message"
4. Wait for confirmation message
5. Form will reset after successful submission

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/qrcode-app)

## 📚 Documentation

- [Project Specification](docs/specification.md) - Detailed requirements and architecture
- [Task List](docs/tasks.md) - Development progress tracking
- [Coding Guidelines](.github/copilot-instructions.md) - Development standards
- [PR Template](.github/prompts/pr.prompt.md) - Pull request guide

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Resend](https://resend.com/) - Email API
- [qrcode](https://www.npmjs.com/package/qrcode) - QR code generation
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**Made with ❤️ using Next.js 16**

## **Custom Agents**

- **Agent manifest**: A Copilot custom-agent manifest has been added at
   ` .github/agents/devtool.agent.json` which references the prompt at
   ` .github/prompts/devtool.prompt.md`.
- **Purpose**: The agent is a helper for automated UI testing using the
   repository-internal DevTools MCP helpers (take snapshots, screenshots,
   interact with UI, collect console and network logs) and stores
   artifacts under `./screenshots/` by default.
- **How to use**: Import or reference the manifest in your VS Code
   Copilot Custom Agents UI (or open the file and follow your Copilot
   extension workflow). Provide a `url` input (for example
   `https://localhost:3000/contact`) when prompted.

If you want, I can wire a simple script to invoke the agent with a
default URL or add example commands to `package.json`.
