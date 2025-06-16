import textract from "textract";

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    let cleaned = "";
    let textractError = false;

    try {
      const text = await new Promise<string>((resolve, reject) => {
        textract.fromBufferWithMime("application/pdf", buffer, (err, text) => {
          if (err) return reject(err);
          resolve(text || "");
        });
      });

      cleaned = text.trim().replace(/\s{2,}/g, " ");
    } catch (err) {
      textractError = true;
    }

    if (textractError) {
      console.warn(`❌ PDF ${file.name} не можа да се обработи с textract`);
      return `⚠️ Неуспешен опит за четене на "${file.name}".`;
    }

    if (cleaned.length < 20) {
      console.warn(
        `⚠️ PDF "${file.name}" не съдържа достатъчно текст. Вероятно е сканиран.`
      );
      return `⚠️ Файлът "${file.name}" вероятно е сканиран PDF и няма текстов слой.`;
    }

    return cleaned;
  } catch (err) {
    console.warn(`❌ PDF критична грешка (${file.name}):`, err);
    return `⚠️ Неуспешен опит за четене на "${file.name}".`;
  }
}
