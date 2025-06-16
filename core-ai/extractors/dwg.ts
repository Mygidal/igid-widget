/**
 * Stub обработка на DWG файл — все още не се поддържа
 */
export async function extractTextFromDwg(file: File): Promise<string> {
  console.warn(`📐 DWG файл "${file.name}" е подаден, но не се поддържа.`);
  return `📐 Файлът "${file.name}" е DWG чертеж. OCR/прочитане още не се поддържа.`;
}
