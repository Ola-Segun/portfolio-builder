import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TextControlProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  debounceMs?: number;
}

export function TextControl({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  debounceMs = 150,
}: TextControlProps) {
  // Local state for the input so typing feels instant
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync if parent value changes externally (e.g. undo/redo)
  useEffect(() => {
    setLocal(value);
  }, [value]);

  const flush = useCallback(
    (v: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      onChange(v);
    },
    [onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setLocal(v);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(v), debounceMs);
    },
    [onChange, debounceMs]
  );

  // Flush immediately on blur (user clicked elsewhere / switched tab)
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      flush(e.target.value);
    },
    [flush]
  );

  // Flush on Enter for single-line inputs
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') flush((e.target as HTMLInputElement).value);
    },
    [flush]
  );

  // Clear timer on unmount (flush already happened on blur)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const sharedClass =
    'w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 placeholder-white/20 transition-colors';

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-white/40 uppercase tracking-wider block">{label}</label>
      {multiline ? (
        <textarea
          value={local}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={3}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={local}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={sharedClass}
        />
      )}
    </div>
  );
}
