"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;
    const formData = new FormData();
    formData.append("question", question);
    files.forEach((f) => formData.append("attachments", f));

    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: data.answer },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "Грешка при заявката" },
      ]);
    } finally {
      setQuestion("");
      setFiles([]);
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
        >
          AI
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[90vw] max-w-md rounded-xl border border-gray-300 bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h2 className="text-sm font-semibold">AI Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-2 p-4 text-sm text-gray-800 max-h-60 overflow-y-auto">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
            {files.length > 0 && (
              <ul className="text-xs text-gray-600 mt-2">
                {files.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t p-2 flex flex-col gap-2">
            <textarea
              className="w-full resize-none border rounded p-2 text-sm"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Вашият въпрос..."
            />
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.dwg"
              className="text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
            >
              {loading ? "Изпращане..." : "Изпрати"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
