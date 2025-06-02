import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";
import { handleDWG } from "@/utils/dwgHandler";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const question = formData.get("question") as string | null;

    // 🔍 Извличане и филтриране на файловете
    const rawFiles = formData.getAll("attachments");
    const files = rawFiles.filter((f): f is File => f instanceof File);

    // ⚠️ Проверка дали има въпрос
    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    // 🛠 Обработка на DWG файловете (stub)
    const processedFiles: File[] = [];
    for (const file of files) {
      if (file.name.toLowerCase().endsWith(".dwg")) {
        processedFiles.push(await handleDWG(file));
      } else {
        processedFiles.push(file);
      }
    }

    // 🧠 Викаме Gemini с въпрос и файлове
    const answer = await askGemini(question, processedFiles);

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("❌ Server Error in /api/ask:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
