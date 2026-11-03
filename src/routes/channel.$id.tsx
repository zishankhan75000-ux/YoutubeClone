import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getChannel, ME } from "@/data/channels";
import { videos, getVideo, type Video } from "@/data/videos";
import { useApp } from "@/context/app-store";
import { VideoGrid } from "@/components/yt/VideoCard";
import { ChannelAvatar, Verified } from "@/components/yt/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/channel/$id")({
  loader: ({ params }) => {
    if (params.id !== "me" && !getChannel(params.id)) throw notFound();
  },
  head: ({ params }) => {
    const c = params.id === "me" ? ME : getChannel(params.id);
    const t = `${c?.name ?? "Channel"} - YouTube Clone`;
    const d = c?.description ?? "Channel profile on YouTube Clone.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ChannelPage,
});

const TABS = ["Home", "Videos", "Shorts", "Playlists", "Community", "About"] as const;

function ChannelPage() {
  const { id } = Route.useParams();
  const app = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Home");
  const isMe = id === "me";
  const c = isMe ? ME : getChannel(id)!;
  const vids: Video[] = isMe
    ? (app.history.slice(0, 8).map(getVideo).filter(Boolean) as Video[])
    : videos.filter((v) => v.channelId === id);
  const subscribed = app.subscriptions.includes(id);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6">
      {/* Channel Banner */}
      <div
        className="h-32 rounded-2xl shadow-inner sm:h-48 md:h-56"
        style={{
          background: `linear-gradient(135deg, var(--chart-${c.tone}) 0%, var(--secondary) 100%)`,
        }}
      />

      {/* Channel Header Information */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <ChannelAvatar
          name={c.name}
          tone={c.tone}
          size={128}
          className="hidden shadow-md sm:inline-flex"
        />
        <ChannelAvatar name={c.name} tone={c.tone} size={72} className="sm:hidden" />
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {c.name} {c.verified && <Verified />}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {c.handle} • {c.subscribers} subscribers • {vids.length} videos
          </p>
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground sm:text-sm">{c.description}</p>
          {!isMe && (
            <button
              onClick={() => app.toggleSubscribe(id)}
              className={cn(
                "mt-3 rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                subscribed
                  ? "bg-secondary text-secondary-foreground hover:bg-accent"
                  : "bg-foreground text-background hover:bg-foreground/90",
              )}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-6 flex gap-6 overflow-x-auto border-b border-border scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 border-b-2 border-transparent pb-3 text-sm font-semibold text-muted-foreground transition-colors",
              tab === t && "border-foreground text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="py-6">
        {(tab === "Home" || tab === "Videos") &&
          (vids.length ? (
            <VideoGrid videos={vids} />
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {isMe
                ? "Your watch history and saved videos will appear here."
                : "No videos published yet."}
            </p>
          ))}
        {tab === "Shorts" && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            This channel has not posted vertical Shorts yet.
          </p>
        )}
        {tab === "Playlists" && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {isMe
              ? `${app.playlists.length} playlists created — manage them on the Playlists page.`
              : "No public playlists available."}
          </p>
        )}
        {tab === "Community" && (
          <div className="max-w-2xl rounded-2xl border border-border/60 bg-secondary/30 p-5 text-sm">
            <div className="flex items-center gap-3">
              <ChannelAvatar name={c.name} tone={c.tone} size={36} />
              <div>
                <p className="font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <p className="mt-3 leading-relaxed">
              Welcome to the channel! Thanks for exploring our demo videos on YouTube Clone.
            </p>
          </div>
        )}
        {tab === "About" && (
          <div className="max-w-2xl rounded-2xl border border-border/60 bg-secondary/30 p-5 text-sm space-y-3">
            <h3 className="text-base font-bold">About {c.name}</h3>
            <p className="text-muted-foreground">{c.description}</p>
            <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground space-y-1">
              <p>Handle: {c.handle}</p>
              <p>Subscribers: {c.subscribers}</p>
              <p>Verified creator: {c.verified ? "Yes" : "No"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
