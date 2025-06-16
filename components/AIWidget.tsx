"use client";

import AttachedFiles from "./AttachedFiles";
import useAIChat from "../hooks/useAIChat";

type Props = {
  onClose: () => void;
};

export default function AIWidget({ onClose }: Props) {
  const {
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
  } = useAIChat("bg");

  return (
    <div className="fixed inset-0 flex flex-col overflow-x-hidden bg-gradient-to-br from-blue-50 to-gray-100 z-50">
      <div className="flex h-full w-full max-w-[100vw] flex-col rounded-none border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center border-b px-4 py-3">
          <div className="flex-1 text-center">
            <h2 className="text-lg font-semibold text-blue-900">
              Консултация с ERMA AI
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 transition-colors hover:text-gray-700"
            aria-label="Затвори чата"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className="chat-container-wrapper flex-1 space-y-4 overflow-y-auto bg-gray-50 px-4 py-4"
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
                className={`chat-message rounded-xl px-4 py-2 text-base shadow-sm ${
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
                            className="rounded-lg max-w-[200px]"
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
          className="flex items-end gap-2 rounded-b-2xl border-t bg-white px-4 py-3"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 10-5.656-5.656L4.344 9.929"
              />
            </svg>
          </label>
          <textarea
            ref={textareaRef}
            placeholder="Съобщение..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={1}
            className="chat-textarea flex-1 border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={
              status === "sending" || (!question.trim() && files.length === 0)
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white shadow transition-colors hover:bg-blue-600 disabled:opacity-50"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
