"use client";

export default function SearchBox({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="جستجو..."
      className="border p-2 w-full mb-4 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}