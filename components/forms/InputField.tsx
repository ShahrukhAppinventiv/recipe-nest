"use client";

import { useField } from "formik";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export function InputField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: InputFieldProps) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={[
          "w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
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
