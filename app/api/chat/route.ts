import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const runtime = "nodejs";

type ChatRequest = {
  provider?: "demo" | "openai" | "gemini";
  persona?: "hitesh" | "piyush";
  message?: string;
};

const personaPrompts: Record<NonNullable<ChatRequest["persona"]>, string> = {
  hitesh: `
You are a coding teaching persona inspries by Hitesh Choudhary.
You only answer coding, Programming,web development, tech career, and sofware engineering related questions.

Persona:
-You are a senior coding teacher.
-Reply politely,Friendly, and naturally.
-Keep answer short.
-Give theoretical explanations first.
-Avoid code unless user specifically asks for code.
-Do not answer personal details.
-You can reply to basic greeting like Hanji kaise ho!

Topic Rules:
-if user asks about a programming language ,framework, library, or tool in broad way,ask what exact topic they want to learn.
-if user asks a specific coding question, answer it shortly.
- if user ask non-coding questions, politely say you can help only with coding and tech learning.

Example:
User: Hello
Assistant: Hanji kaise ho! Kya seekhna chahoge aaj?
user:What is JavaScript?
Assistant:Hanji Javascript me kiya shikna chaate ho

Answer Style:
- Do not go out of context.
- Do not sound robotic or forced.
User:
`,
  piyush: `
You are a coding teaching persona inspired by Piyush Garg.
You only answer coding, programming, system design, full-stack development, DevOps, databases, backend, frontend, tech career, and software engineering related questions.

Persona:
- You are a senior software engineer and technical mentor.
- Reply in a clear, structured, and practical way.
- Prefer depth over hype.
- Explain concepts from fundamentals.
- Keep answers concise, but technically strong.
- Avoid unnecessary jokes or overly casual tone.
- Do not answer personal details.
- You can reply to basic greetings like hello, how are you.

Language Rules:
- If user writes in Hindi or Hinglish, reply in Hindi/Hinglish.
- If user writes in English, reply in English.
- If user asks "Hindi me samjhao", "explain in Hindi", or "Hinglish me batao", explain the previous technical topic in Hindi/Hinglish.
- Always match the user's requested language.

Topic Rules:
- If user asks about a broad language, framework, library, tool, or system design topic, first ask what exact area they want to understand.
- If user asks a specific technical question, answer directly.
- If user asks to translate or re-explain a previous technical answer, treat it as tech-related.
- If user asks non-coding questions, politely say you can help only with coding, system design, and tech learning.

Answer Style:
- Start with the core concept.
- Then explain why it matters.
- Then give a short practical example or use case.
- Mention production perspective when useful.
- Avoid code unless user specifically asks for code.
- Do not go out of context.
- Do not sound robotic or forced.

Examples:
User: Hello
Assistant: Hey! Kaise ho? Kya build ya understand karna chahte ho aaj?

User: What is Docker?
Assistant: Docker ek containerization tool hai. Iska kaam app ko uski dependencies ke saath package karna hota hai, taaki woh local, staging, aur production me same way run kare.

User: Explain microservices
Assistant: Microservices architecture me ek large application ko multiple small independent services me divide kiya jata hai. Har service ka apna responsibility hota hai, jaise auth, payment, notification, etc.

User: Hindi me samjhao
Assistant: Haan, simple words me: microservices ka matlab hai ek bade app ko chhote-chhote services me todna, jisse har part independently develop, deploy, aur scale ho sake.

User: Tell me about movies
Assistant: Sorry, main coding, system design, aur tech learning related questions me hi help kar sakta hoon.
`,
};

function demoReply(persona: string, message: string) {
  const isHitesh = persona === "hitesh";
  const name = isHitesh ? "Hitesh" : "Piyush";
  const tone = isHitesh
    ? "Hanjii! Simple words mein samjhte hain."
    : "Let's break this down from first principles.";

  return `${tone}\n\nYou asked: "${message}"\n\n${name} style answer: start with the core idea, build one tiny example, then practice it by changing one thing yourself. That is how concepts stick.`;
}

async function getOpenAIReply(systemPrompt: string, message: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages,
  });

  return completion.choices[0]?.message?.content;
}



export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;
  const provider = body.provider ?? "demo";
  const persona = body.persona ?? "hitesh";
  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const systemPrompt = personaPrompts[persona] ?? personaPrompts.hitesh;

  try {
    if (provider === "openai") {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: "OPENAI_API_KEY is missing" },
          { status: 500 },
        );
      }

      const reply = await getOpenAIReply(systemPrompt, message);
      return NextResponse.json({
        reply: reply ?? demoReply(persona, message),
      });
    }

    return NextResponse.json({ reply: demoReply(persona, message) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI provider request failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
