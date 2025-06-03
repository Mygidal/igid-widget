"use client";

import { useState } from "react";
import Image from "next/image";
import AIWidget from "@/components/AIWidget";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        {/* 🧠 Тук се появява бутонът */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
          >
            AI
          </button>
        )}

        {open && <AIWidget onClose={() => setOpen(false)} />}

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* ... бутоните за Deploy и Docs остават същите ... */}
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* ... футър линкове остават същите ... */}
      </footer>
    </div>
  );
}
