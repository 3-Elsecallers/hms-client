"use client";

import { useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const updateDigit = (index: number, char: string) => {
    const next = [...digits];
    next[index] = char;
    onChange(next.join(""));
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    updateDigit(index, char);
    if (char && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        updateDigit(index, "");
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        updateDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const padded = (pasted + " ".repeat(length)).slice(0, length).replace(/ /g, "");
    onChange(padded);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <Box sx={{ display: "flex", gap: { xs: 1, sm: 1.5 }, justifyContent: "center" }}>
      {Array.from({ length }, (_, i) => (
        <TextField
          key={i}
          inputRef={(el) => { refs.current[i] = el; }}
          value={digits[i]}
          onChange={(e) => handleChange(i, e as ChangeEvent<HTMLInputElement>)}
          onKeyDown={(e) => handleKeyDown(i, e as KeyboardEvent<HTMLInputElement>)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          error={hasError}
          slotProps={{
            htmlInput: {
              maxLength: 1,
              inputMode: "numeric" as const,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                padding: "14px 8px",
              },
            },
          }}
          sx={{
            width: { xs: 46, sm: 54 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: digits[i] ? "rgba(74, 140, 133, 0.08)" : undefined,
              "& fieldset": {
                borderColor: hasError ? "error.main" : digits[i] ? "primary.main" : undefined,
                borderWidth: digits[i] ? "1.5px" : undefined,
              },
            },
          }}
        />
      ))}
    </Box>
  );
}
