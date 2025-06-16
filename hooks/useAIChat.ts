import { useEffect, useRef, useState } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
  files?: { name: string; url: string }[];
  preview?: boolean;
};

export type Status = "idle" | "sending" | "error";

export default function useAIChat(lang: "bg" | "en" | "de" = "bg") {
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
  const [status, setStatus] = useState<Status>("idle");

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

    Promise.all(previews).then((results) => {
      setFilePreviews(results);
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: question || "",
          files: results,
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
    files.forEach((file) => formData.append("attachments", file)); // 🟢 ключът тук трябва да е "attachments"

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

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

  return {
    messages,
    question,
    setQuestion,
    files,
    filePreviews,
    status,
    chatContainerRef,
    textareaRef,
    handleFileChange,
    handleAsk,
    handleRemoveFile,
  };
}
