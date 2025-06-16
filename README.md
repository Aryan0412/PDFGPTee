# AI Q&A System

**An AI-driven Q&A system with PDF support, built using Next.js 15, OpenAI, and Clerk, featuring real-time chat, vector search, and modern UI components.**

---

## 🚀 Tech Stack

### 🖥️ Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Components**:
  - Radix UI
  - ShadCN UI
  - Tailwind CSS
- **State Management**: React Query
- **Authentication**: Clerk
- **External Tools**:
  - Vercel AI SDK (for streaming chat generation)

### 🗄️ Backend
- **Database**:
  - NeonDB (for data storage)
  - Pinecone (for vector storage)
- **ORM**: Drizzle ORM
- **External Services**:
  - OpenAI SDK (for AI responses)
  - AWS S3 (for file storage)
  - Stripe (for payment processing)

---

## 📁 Project Structure

```bash
PDFGPTee/
├── .git/
├── .next/
├── node_modules/
├── public/
├── src/
├── app/
│   ├── api/
│   ├── chat/
│   ├── sign-in/
│   ├── sign-up/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── FileUpload.tsx
│   └── Providers.tsx
├── lib/
│   └── middleware.ts
├── .env
├── .gitignore
├── components.json
├── drizzle.config.ts
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
