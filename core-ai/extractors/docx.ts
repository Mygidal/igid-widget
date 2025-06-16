import mammoth from "mammoth";

/**
 * Извлича текст от DOCX файл (OpenXML формат)
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await mammoth.extractRawText({ buffer });
    const cleaned = result.value.trim().replace(/\s{2,}/g, " ");
    return cleaned || "⚠️ Не беше извлечен текст от DOCX файла.";
  } catch (err) {
    console.warn(`❌ Грешка при четене на DOCX файл "${file.name}":`, err);
    return `⚠️ Неуспешен опит за четене на "${file.name}".`;
  }
}
