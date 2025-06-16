import { extractTextFromPDF } from "./extractors/pdf";
import { extractTextFromImage } from "./extractors/image";
import { extractTextFromDocx } from "./extractors/docx";
import { extractTextFromXlsx } from "./extractors/xlsx";
import { extractTextFromDwg } from "./extractors/dwg";

/**
 * Приема списък от файлове и извлича текст от всеки, според типа му.
 */
export async function processFiles(files: File[]): Promise<string[]> {
  const results: string[] = [];

  for (const file of files) {
    const name = file.name.toLowerCase();

    try {
      if (name.endsWith(".pdf")) {
        const text = await extractTextFromPDF(file);
        console.log(`📄 Извлечен текст от PDF ${file.name}:\n`, text);
        results.push(`📄 ${file.name}:\n${text}`);
      } else if (name.match(/\.(png|jpe?g)$/)) {
        const text = await extractTextFromImage(file);
        console.log(`🖼️ OCR от ${file.name}:\n`, text);
        results.push(`🖼️ ${file.name} (OCR):\n${text}`);
      } else if (name.endsWith(".docx")) {
        const text = await extractTextFromDocx(file);
        console.log(`📝 Текст от DOCX ${file.name}:\n`, text);
        results.push(`📄 ${file.name} (DOCX):\n${text}`);
      } else if (name.endsWith(".xlsx")) {
        const text = await extractTextFromXlsx(file);
        console.log(`📊 Данни от Excel ${file.name}:\n`, text);
        results.push(`📊 ${file.name} (Excel):\n${text}`);
      } else if (name.endsWith(".dwg")) {
        const text = await extractTextFromDwg(file);
        console.log(`📐 DWG Placeholder за ${file.name}:\n`, text);
        results.push(`📐 ${file.name} (DWG):\n${text}`);
      } else {
        console.log(`⚠️ Непознат тип файл: ${file.name}`);
        results.push(`⚠️ Неподдържан тип файл: ${file.name}`);
      }
    } catch (err) {
      console.warn(`❌ Грешка при обработка на файл "${file.name}":`, err);
      results.push(`⚠️ Неуспешна обработка на ${file.name}`);
    }
  }

  return results;
}
