import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlaySquare } from "lucide-react";
import { videos } from "@/data/videos";
import { channels, getChannel } from "@/data/channels";
import { useApp } from "@/context/app-store";
import { VideoGrid } from "@/components/yt/VideoCard";
import { ChannelAvatar, EmptyState } from "@/components/yt/primitives";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subscriptions")({
  head: () =>
    pageHead("Subscriptions", "Latest uploads from channels you follow on YouTube Clone."),
  component: Subs,
});

function Subs() {
  const app = useApp();
  const [filter, setFilter] = useState<string>("all");
  const subs = app.subscriptions.map(getChannel).filter(Boolean) as typeof channels;
  const ids = filter === "all" ? app.subscriptions : [filter];
  const latest = videos
    .filter((v) => ids.includes(v.channelId))
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));
  const suggestions = channels.filter((c) => !app.subscriptions.includes(c.id)).slice(0, 6);

  return (
    <div className="px-4 py-4 sm:px-6">
      {/* Horizontal channel avatars */}
      <div className="mb-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilter("all")}
          className={cn("yt-chip self-center", filter === "all" && "yt-chip-active")}
        >
          All
        </button>
        {subs.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={cn(
              "flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-xl p-2 text-xs transition-colors",
              filter === c.id ? "bg-secondary font-semibold" : "hover:bg-secondary/60",
            )}
          >
            <ChannelAvatar name={c.name} tone={c.tone} size={52} />
            <span className="w-full truncate text-center text-[11px] text-foreground">
              {c.name}
            </span>
          </button>
        ))}
      </div>

      <h2 className="mb-4 text-xl font-bold tracking-tight">Latest uploads</h2>
      {latest.length ? (
        <VideoGrid videos={latest} />
      ) : (
        <EmptyState
          icon={<PlaySquare className="h-16 w-16" />}
          title="No subscription videos"
          text="Subscribe to channels to see their latest uploads here."
        />
      )}

      <h2 className="mb-4 mt-12 text-xl font-bold tracking-tight">Channels you might like</h2>
      <div className="grid grid-cols-2 gap-4 pb-8 sm:grid-cols-3 lg:grid-cols-6">
        {suggestions.map((c) => (
          <div
            key={c.id}
            className="flex flex-col items-center gap-2 rounded-2xl bg-secondary/60 p-4 text-center transition-colors hover:bg-secondary"
          >
            <Link to="/channel/$id" params={{ id: c.id }}>
              <ChannelAvatar name={c.name} tone={c.tone} size={64} />
            </Link>
            <Link
              to="/channel/$id"
              params={{ id: c.id }}
              className="line-clamp-1 text-sm font-semibold hover:underline"
            >
              {c.name}
            </Link>
            <p className="text-xs text-muted-foreground">{c.subscribers} subscribers</p>
            <button
              onClick={() => app.toggleSubscribe(c.id)}
              className="mt-1 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
