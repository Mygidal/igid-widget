import textract from "textract";

/**
 * Чете текст от PDF файл, използвайки textract (работи в Node.js)
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
    return cleaned || "⚠️ Не е извлечен текст от PDF файла.";
  } catch (err) {
    console.warn(`❌ Грешка при четене на PDF файл "${file.name}":`, err);
    return `⚠️ Неуспешен опит за четене на "${file.name}".`;
  }
}
