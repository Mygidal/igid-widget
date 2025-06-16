export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";
// import { askGPT } from "@/lib/gpt"; // по избор, fallback
import { processFiles } from "@/core-ai/processFiles";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const question = formData.get("question") as string | null;

    const rawFiles = formData.getAll("attachments");
    const files = rawFiles.filter((f): f is File => f instanceof File);

    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    // 🔎 Преобразуване на файловете в текстове (OCR, PDF, DOCX и др.)
    let context = "";
    try {
      const fileTexts = await processFiles(files);
      context = fileTexts.join("\n\n");
    } catch (err) {
      console.warn("⚠️ Грешка при обработка на файловете:", err);
      context = "⚠️ Някои файлове не можаха да бъдат прочетени.";
    }

    const finalQuestion = `${question}\n\n📎 Информация от прикачени файлове:\n${context}`;

    console.log("🧠 Въпрос, изпратен към Gemini:\n", finalQuestion);

    let answer: string;
    try {
      answer = await askGemini(finalQuestion, files);
    } catch (err) {
      console.error("❌ Грешка при запитване към Gemini:", err);
      answer = "⚠️ Неуспешен опит за извличане на отговор от AI.";
      // По избор: fallback към OpenAI
      // answer = await askGPT(finalQuestion, files);
    }

    console.log("📬 Отговор от Gemini:\n", answer);

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("❌ Server Error in /api/ask:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
