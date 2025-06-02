"use client";

type Props = {
  files: { name: string; url: string }[];
  onRemove: (index: number) => void;
};

export default function AttachedFiles({ files, onRemove }: Props) {
  if (files.length === 0) return null;

  return (
    <div className="border-t bg-white px-4 py-2 text-sm text-gray-700">
      <p className="mb-2 font-medium">Прикачени файлове:</p>
      <ul className="flex flex-wrap gap-2">
        {files.map((file, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2 rounded bg-gray-100 px-2 py-1"
          >
            <span>{file.name}</span>
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="text-gray-500 hover:text-red-600"
              title="Премахни файл"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
