"use client";

import { useState } from "react";
import Image from "next/image";
import AIWidget from "@/components/AIWidget";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <ol className="list-inside list-decimal text-sm text-center sm:text-left">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-mono font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        {/* 🧠 Тук се появява бутонът за чата */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
          >
            AI
          </button>
        )}

        {open && <AIWidget onClose={() => setOpen(false)} />}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm">
        <a
          className="flex items-center gap-2 hover:underline"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/file.svg" alt="" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline"
          href="https://vercel.com/templates"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/window.svg" alt="" width={16} height={16} />
          Templates
        </a>
        <a
          className="flex items-center gap-2 hover:underline"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/globe.svg" alt="" width={16} height={16} />
          nextjs.org →
        </a>
      </footer>
    </div>
  );
}
