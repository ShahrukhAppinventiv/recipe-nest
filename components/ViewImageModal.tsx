"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ViewImageModalProps = {
  src: string | null;
  alt: string;
  children: React.ReactNode;
  fallbackText?: string;
};

export function ViewImageModal({
  src,
  alt,
  children,
  fallbackText,
}: ViewImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          aria-label={`View ${alt}`}
        >
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-6 flex flex-col items-center justify-center bg-card">
        <DialogTitle className="sr-only">Image Viewer</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed view of the selected image
        </DialogDescription>

        <div className="mt-6 relative flex h-64 w-64 items-center justify-center rounded-full overflow-hidden bg-primary/10 ring-4 ring-primary/15 md:h-80 md:w-80 shadow-inner">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <span className="text-6xl font-semibold text-primary md:text-8xl select-none">
              {fallbackText || "RN"}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
