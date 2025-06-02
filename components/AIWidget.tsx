"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AttachedFiles from "./AttachedFiles";

type Message = {
  role: "user" | "assistant";
  content: string;
  files?: { name: string; url: string }[];
  preview?: boolean;
};

export default function AIAssistant({
  lang = "bg",
}: {
  lang?: "bg" | "en" | "de";
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<
    { name: string; url: string }[]
  >([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        lang === "bg"
          ? "Здравей! Аз съм ERMA AI. С какво мога да помогна?"
          : lang === "en"
          ? "Hello! I'm ERMA AI. How can I assist you?"
          : "Hallo! Ich bin ERMA AI. Wie kann ich helfen?",
    },
  ]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [question]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);

    const previews = fileArray.map(
      (file) =>
        new Promise<{ name: string; url: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              url: typeof reader.result === "string" ? reader.result : "",
            });
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(previews).then((filePreviews) => {
      setFilePreviews(filePreviews);
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: question || "",
          files: filePreviews,
          preview: true,
        },
      ]);
    });
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() && files.length === 0) return;

    setMessages((prev) => prev.filter((msg) => !msg.preview));

    const userMessage: Message = {
      role: "user",
      content: question,
      files: filePreviews,
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setFiles([]);
    setFilePreviews([]);
    setStatus("sending");

    const formData = new FormData();
    formData.append("question", question || "Потребителят качи файлове.");
    formData.append("lang", lang);
    files.forEach((file) => formData.append("attachment", file));

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      const data = JSON.parse(text);

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer || "🤖 Няма отговор от ERMA AI.",
            files: data.files || [],
          },
        ]);
        setStatus("idle");
      } else {
        throw new Error(data.error || "Грешка при отговора.");
      }
    } catch (err) {
      console.error("❌ Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Възникна грешка при свързване с ERMA AI.",
        },
      ]);
      setStatus("error");
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...filePreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setFilePreviews(updatedPreviews);

    if (updatedFiles.length === 0 && !question.trim()) {
      setMessages((prev) => prev.filter((msg) => !msg.preview));
    } else {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.preview ? { ...msg, files: updatedPreviews } : msg
        )
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden overscroll-contain touch-manipulation">
      <div className="flex h-full w-full max-w-[100vw] flex-col border border-gray-200 bg-white shadow-xl sm:rounded-xl max-h-[100svh]">
        <div className="flex items-center border-b px-4 py-3">
          <h2 className="flex-1 text-center text-lg font-semibold text-blue-900">
            {lang === "bg" && "Консултация с ERMA AI"}
            {lang === "en" && "Consult with ERMA AI"}
            {lang === "de" && "Beratung mit ERMA AI"}
          </h2>
          <button
            onClick={() => router.push("/")}
            className="ml-auto text-gray-500 hover:text-gray-700"
            aria-label="Затвори чата"
          >
            ✕
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 space-y-4 overflow-y-auto bg-gray-50 px-4 py-4 text-sm scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-xl px-4 py-2 max-w-[85%] whitespace-pre-wrap shadow-sm ${
                  msg.role === "user"
                    ? "rounded-br-none bg-blue-500 text-white"
                    : "rounded-bl-none bg-gray-200 text-gray-900"
                }`}
              >
                {msg.content}
                {msg.files && msg.files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.files.map((file, fileIdx) => (
                      <div key={fileIdx}>
                        {file.name.match(/\.(jpg|jpeg|png)$/i) ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="rounded-lg max-h-40"
                          />
                        ) : (
                          <a
                            href={file.url}
                            download={file.name}
                            className="text-sm text-blue-300 underline hover:text-blue-400"
                          >
                            {file.name}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {msg.preview && (
                  <span className="mt-1 block text-xs text-yellow-400">
                    (Преглед, не е изпратен)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <AttachedFiles files={filePreviews} onRemove={handleRemoveFile} />

        <form
          onSubmit={handleAsk}
          className="flex items-end gap-2 border-t bg-white px-4 py-3 sticky bottom-0 z-10"
        >
          <input
            type="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="attachFile"
            multiple
          />
          <label
            htmlFor="attachFile"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
            title="Прикачи файл"
          >
            📎
          </label>
          <textarea
            ref={textareaRef}
            placeholder="Съобщение..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={1}
            className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={
              status === "sending" || (!question.trim() && files.length === 0)
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white shadow hover:bg-blue-600 disabled:opacity-50"
          >
            {status === "sending" ? (
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              "➤"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
