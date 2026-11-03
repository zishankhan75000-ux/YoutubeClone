import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { HelpCircle, ShieldAlert, Film, MonitorPlay } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => pageHead("Help", "Help center and FAQ for YouTube Clone."),
  component: Help,
});

function Help() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Help & Information</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Answers to common questions about this clone
        </p>
      </div>

      <div className="space-y-4 text-sm leading-relaxed">
        <div className="rounded-2xl border border-border/40 bg-secondary/30 p-5">
          <div className="flex items-center gap-2.5 font-semibold text-foreground">
            <MonitorPlay className="h-5 w-5 text-brand" />
            <h3>Project Overview</h3>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            This YouTube Clone is an educational frontend recreation built with modern React,
            TanStack Start/Router, and Tailwind CSS. It replicates the desktop and mobile interface
            of YouTube.com.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-secondary/30 p-5">
          <div className="flex items-center gap-2.5 font-semibold text-foreground">
            <Film className="h-5 w-5 text-brand" />
            <h3>Video Playback & Embeds</h3>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Videos play using YouTube's official privacy-enhanced iframe embeds (
            <code className="rounded bg-secondary px-1 py-0.5">youtube-nocookie.com</code>). All
            video metadata, channel details, and duration indicators are modeled faithfully.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-secondary/30 p-5">
          <div className="flex items-center gap-2.5 font-semibold text-foreground">
            <ShieldAlert className="h-5 w-5 text-brand" />
            <h3>Demo Data & Privacy</h3>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Subscriptions, likes, dislikes, watch history, custom playlists, and comments are stored
            only in your browser's{" "}
            <code className="rounded bg-secondary px-1 py-0.5">localStorage</code>. No external
            backend, database, or login service is required.
          </p>
        </div>

        <div className="pt-4 text-center">
          <Link to="/" className="yt-pill">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
