export async function askGemini(
  question: string,
  files: File[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey.trim()) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  // ✅ Актуален модел за версия v1
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: question }],
      },
    ],
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Gemini API Error:", errorText);
    throw new Error(`Gemini request failed: ${res.status}`);
  }

  const data = await res.json();

  const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!result) {
    throw new Error("Gemini did not return a valid response");
  }

  return result;
}
