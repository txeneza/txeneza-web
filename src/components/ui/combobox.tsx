"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, Check, Search, X } from "lucide-react";

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  id?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Sem resultados.",
  disabled = false,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.trim().toLowerCase())
  );

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Foca a pesquisa ao abrir
  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const select = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlight]) select(filtered[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-grey100 dark:bg-grey950 border border-grey200 dark:border-grey800 rounded-xl py-2.5 px-3.5 text-sm text-left focus:outline-none focus:border-limeGreen/50 focus:ring-2 focus:ring-limeGreen/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={value ? "text-grey900 dark:text-grey50" : "text-grey400 dark:text-grey600"}>
          {value || placeholder}
        </span>
        <ChevronsUpDown className="w-4 h-4 text-grey400 dark:text-grey600 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full bg-light-background dark:bg-grey900 border border-grey200 dark:border-grey800 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-grey200 dark:border-grey800">
            <Search className="w-4 h-4 text-grey400 dark:text-grey600 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlight(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-grey900 dark:text-grey50 placeholder:text-grey400 dark:placeholder:text-grey600 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-grey400 dark:text-grey600 hover:text-grey600 dark:hover:text-grey400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3.5 py-2.5 text-sm text-grey500 dark:text-grey500">{emptyMessage}</li>
            ) : (
              filtered.map((option, idx) => {
                const isSelected = option === value;
                const isHighlighted = idx === highlight;
                return (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => select(option)}
                      onMouseEnter={() => setHighlight(idx)}
                      className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm text-left transition-colors ${
                        isHighlighted
                          ? "bg-forestGreen/10 dark:bg-limeGreen/10 text-forestGreen dark:text-limeGreen"
                          : "text-grey900 dark:text-grey50"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && <Check className="w-4 h-4 text-forestGreen dark:text-limeGreen shrink-0" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
