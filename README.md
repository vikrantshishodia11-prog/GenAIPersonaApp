# Persona AI

A fully responsive Next.js 15 + Tailwind CSS persona chat interface inspired by a ChatGPT-style experience.

## Features

- Dark glass UI with animated message flow
- Responsive sidebar and mobile chat layout
- Persona cards for Hitesh Choudhary and Piyush Garg
- Demo mode that works without API keys
- API route ready for OpenAI or Gemini
- Framer Motion animations and Lucide icons

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Connect AI Providers

Copy `.env.example` to `.env.local`, then add either:

```bash
OPENAI_API_KEY=your_key_here
```

or:

```bash
GEMINI_API_KEY=your_key_here
```

Use the provider selector in the chat header to switch between Demo, OpenAI, and Gemini.

The integration point is `app/api/chat/route.ts`.
