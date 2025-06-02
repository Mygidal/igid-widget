const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function askGemini(
  question: string,
  files: File[] = [] // запазено за бъдеща поддръжка
): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error("❌ Липсва Gemini API ключ!");
    return "Вътрешна грешка: API ключът липсва.";
  }

  const systemPrompt = `
Ти си AI асистент на строителна фирма ERMA.
Отговаряй ясно, кратко и на български. При нужда искай уточнение от потребителя.
`.trim();

  const contents = [
    {
      role: "user",
      parts: [{ text: systemPrompt }, { text: question }],
    },
  ];

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Грешка от Gemini API:", errorText);
      return "AI сървърът върна грешка. Опитай отново.";
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.warn("⚠️ Няма текстов отговор от Gemini:", data);
      return "Няма отговор от AI.";
    }

    return reply;
  } catch (err: any) {
    console.error("❌ Изключение при заявка към Gemini:", err);
    return "Възникна грешка при връзката с AI.";
  }
}
