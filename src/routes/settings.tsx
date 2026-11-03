import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/context/app-store";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Moon, Sun, Trash2 } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => pageHead("Settings", "Account and display preferences on YouTube Clone."),
  component: Settings,
});

function Settings() {
  const app = useApp();
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Customize your viewing and application preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <section className="rounded-2xl border border-border/40 bg-secondary/30 p-5">
          <h2 className="text-base font-semibold">Appearance</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose your preferred light or dark YouTube Clone theme
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => app.setTheme("dark")}
              className={cn(
                "flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold transition-all",
                app.theme === "dark"
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              <Moon className="h-4 w-4" />
              <span>Dark theme</span>
            </button>
            <button
              onClick={() => app.setTheme("light")}
              className={cn(
                "flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold transition-all",
                app.theme === "light"
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              <Sun className="h-4 w-4" />
              <span>Light theme</span>
            </button>
          </div>
        </section>

        {/* Local Storage & Data */}
        <section className="rounded-2xl border border-border/40 bg-secondary/30 p-5">
          <h2 className="text-base font-semibold">Privacy & Local Data</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your subscriptions, likes, comments, and playlists are stored locally in your browser's
            localStorage.
          </p>
          <div className="mt-4">
            <button
              className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              onClick={app.clearHistory}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear watch history</span>
            </button>
          </div>
        </section>

        {/* About App */}
        <section className="rounded-2xl border border-border/40 bg-secondary/30 p-5 text-xs text-muted-foreground space-y-2">
          <h3 className="font-semibold text-foreground">About YouTube Clone</h3>
          <p>Version 2.0 • Production Build</p>
          <p>Built with React, Vite, TanStack Router, and Tailwind CSS.</p>
        </section>
      </div>
    </div>
  );
}
