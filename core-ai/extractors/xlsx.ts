import * as XLSX from "xlsx";

/**
 * Извлича текст от Excel (.xlsx) файл — всички таблици като текст
 */
export async function extractTextFromXlsx(file: File): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const output: string[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      output.push(`📊 Sheet: ${sheetName}\n${csv.trim()}`);
    }

    return output.join("\n\n") || "⚠️ Файлът не съдържа таблици.";
  } catch (err) {
    console.warn(`❌ Грешка при четене на Excel файл "${file.name}":`, err);
    return `⚠️ Неуспешен опит за четене на "${file.name}".`;
  }
}
