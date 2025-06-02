import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";
import { handleDWG } from "@/utils/dwgHandler";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const question = formData.get("question") as string | null;
    const files = formData.getAll("attachments") as File[];

    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const processed: File[] = [];
    for (const file of files) {
      if (file.name.toLowerCase().endsWith(".dwg")) {
        processed.push(await handleDWG(file));
      } else {
        processed.push(file);
      }
    }

    const answer = await askGemini(question, processed);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
