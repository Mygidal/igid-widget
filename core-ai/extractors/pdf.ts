import textract from "textract";

/**
 * Извлича текст от PDF файл. Ако няма текст, връща съобщение за OCR нужда.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const text = await new Promise<string>((resolve, reject) => {
      textract.fromBufferWithMime("application/pdf", buffer, (err, text) => {
        if (err) return reject(err);
        resolve(text || "");
      });
    });

    const cleaned = text.trim().replace(/\s{2,}/g, " ");

    if (cleaned.length < 20) {
      console.warn(
        `⚠️ PDF "${file.name}" не съдържа достатъчно текст. Вероятно е сканиран документ.`
      );
      return `⚠️ Файлът "${file.name}" вероятно е сканиран PDF и няма текстов слой. OCR обработка предстои.`;
    }

    return cleaned;
  } catch (err) {
    console.warn(`❌ PDF грешка (${file.name}):`, err);
    return `⚠️ Неуспешен опит за четене на "${file.name}".`;
  }
}
