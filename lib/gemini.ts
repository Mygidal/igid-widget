export async function askGemini(
  question: string,
  files: File[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: question },
          // TODO: handle file uploads with Gemini API when supported
        ],
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
    throw new Error(`Gemini request failed: ${res.status}`);
  }

  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text || "Няма отговор от Gemini"
  );
}
