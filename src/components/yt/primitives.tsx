import { useEffect, useRef, useState, type ReactNode } from "react";
import { BadgeCheck, Film, X } from "lucide-react";
import { thumb } from "@/data/videos";
import { cn } from "@/lib/utils";

export function ChannelAvatar({
  name,
  tone,
  size = 36,
  className,
}: {
  name: string;
  tone: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium text-brand-foreground",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `var(--chart-${tone})`,
      }}
      aria-hidden
    >
      {name.replace(/^@/, "").charAt(0).toUpperCase()}
    </span>
  );
}

export function Verified() {
  return (
    <BadgeCheck
      className="inline h-3.5 w-3.5 shrink-0 text-muted-foreground"
      aria-label="Verified"
    />
  );
}

export function Thumbnail({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary p-4 text-center text-muted-foreground",
          className,
        )}
      >
        <Film className="h-8 w-8" />
        <span className="line-clamp-2 text-xs">{title}</span>
      </div>
    );
  return (
    <img
      src={thumb(id)}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

/** Small popover that closes on outside click. */
export function useDismiss<T extends HTMLElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, close]);
  return ref;
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay/60 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-label={title}
        className="w-full max-w-md rounded-2xl bg-popover p-5 text-popover-foreground shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="yt-icon-btn" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  children,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="text-muted-foreground">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      {children}
    </div>
  );
}

export function Logo() {
  return (
    <span className="flex select-none items-center gap-1.5 font-sans">
      <svg
        className="h-6 w-[29px] shrink-0 text-[#ff0000]"
        viewBox="0 0 28 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M27.42 3.12A3.48 3.48 0 0 0 24.97.66C22.8 0 14 0 14 0S5.2 0 3.03.66A3.48 3.48 0 0 0 .58 3.12C0 5.3 0 10 0 10s0 4.7.58 6.88a3.48 3.48 0 0 0 2.45 2.46c2.17.66 10.97.66 10.97.66s8.8 0 10.97-.66a3.48 3.48 0 0 0 2.45-2.46c.58-2.18.58-6.88.58-6.88s0-4.7-.58-6.88Z"
          fill="currentColor"
        />
        <path d="m11.2 14.28 7.28-4.28-7.28-4.28v8.56Z" fill="#ffffff" />
      </svg>
      <span className="flex items-center text-lg font-bold tracking-tight text-foreground">
        YouTube
        <span className="ml-1 text-[10px] font-normal tracking-normal text-muted-foreground">
          Clone
        </span>
      </span>
    </span>
  );
}
