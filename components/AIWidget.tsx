"use client";

import { useState } from "react";

export default function AIWidget() {
  const [open, setOpen] = useState(false);

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
        <div className="fixed bottom-4 right-4 z-50 w-[90vw] max-w-md rounded-xl border border-gray-300 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h2 className="text-sm font-semibold">AI Assistant</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <div className="p-4 text-sm text-gray-800">
            <p>Здравей! Аз съм AI помощник. Как мога да помогна?</p>
            {/* Тук по-късно ще вмъкнем съобщения, input, файлове и т.н. */}
          </div>
        </div>
      )}
    </>
  );
}
