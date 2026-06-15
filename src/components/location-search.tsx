"use client";

import { useEffect, useState } from "react";
import { searchLocation, Location } from "@/lib/ride-calculator";

type Props = {
  label: string;
  placeholder: string;
  icon: string;
  onSelect: (location: Location) => void;
  value: Location | null;
};

export function LocationSearch({ label, placeholder, icon, onSelect, value }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value && !query) setQuery(value.name);
  }, [value]);

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await searchLocation(query);
      setResults(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(location: Location) {
    onSelect(location);
    setQuery(location.name);
    setOpen(false);
    setResults([]);
  }

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {icon} {label}
      </label>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500"
      />

      {loading && (
        <div className="absolute left-3 top-11 text-sm text-slate-400">
          جاري البحث...
        </div>
      )}

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          {results.map((result, i) => (
            <button
              key={i}
              onClick={() => handleSelect(result)}
              className="block w-full border-b border-slate-100 px-4 py-3 text-right text-sm hover:bg-slate-50"
            >
              <p className="font-bold text-slate-900">📍 {result.name}</p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {result.displayName}
              </p>
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 3 && !loading && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-xl">
          مفيش نتائج — جرب اسم تاني
        </div>
      )}
    </div>
  );
}
