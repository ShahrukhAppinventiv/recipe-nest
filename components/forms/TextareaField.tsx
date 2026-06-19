"use client";

import { useField } from "formik";

interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({
  name,
  label,
  placeholder,
  rows = 5,
}: TextareaFieldProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        {...field}
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={[
          "w-full resize-none rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
          hasError ? "border-red-400 focus:ring-red-200" : "border-border",
        ].join(" ")}
      />
      {hasError && (
        <p className="text-xs text-red-500" role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
}
