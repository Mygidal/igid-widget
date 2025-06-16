import Tesseract from "tesseract.js";

/**
 * OCR: Извлича текст от PNG или JPG изображения
 */
export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data } = await Tesseract.recognize(buffer, "bul+eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`🧠 OCR напредък: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const cleaned = data.text.trim().replace(/\s{2,}/g, " ");
    return cleaned || "⚠️ Не беше разпознат текст в изображението.";
  } catch (err) {
    console.warn(`❌ Грешка при OCR на файл "${file.name}":`, err);
    return `⚠️ Неуспешен опит за OCR на "${file.name}".`;
  }
}
