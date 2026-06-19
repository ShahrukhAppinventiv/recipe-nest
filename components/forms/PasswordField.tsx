"use client";

import { useField } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
}

export function PasswordField({
  name,
  label,
  placeholder,
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [field, meta] = useField(name);
  const [visible, setVisible] = useState(false);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          {...field}
          id={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            "w-full rounded-lg border bg-background px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
            hasError ? "border-red-400 focus:ring-red-200" : "border-border",
          ].join(" ")}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
      {hasError && (
        <p className="text-xs text-red-500" role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
}
