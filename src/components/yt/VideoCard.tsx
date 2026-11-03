import { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ban, Clock, EllipsisVertical, ListPlus, Share2 } from "lucide-react";
import type { Video } from "@/data/videos";
import { getChannel } from "@/data/channels";
import { formatCount, timeAgo } from "@/lib/format";
import { useApp } from "@/context/app-store";
import { cn } from "@/lib/utils";
import { ChannelAvatar, Thumbnail, Verified, useDismiss } from "./primitives";
import { SaveModal, ShareModal } from "./SaveMenu";

function VideoMenu({ video }: { video: Video }) {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<"save" | "share" | null>(null);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));

  const item = (fn: () => void) => () => {
    fn();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        className="yt-icon-btn -mr-1.5 h-8 w-8 text-muted-foreground opacity-80 transition-opacity hover:text-foreground group-hover:opacity-100"
        aria-label="More actions"
        onClick={() => setOpen((o) => !o)}
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="yt-menu right-0 top-9">
          <button className="yt-menu-item" onClick={item(() => app.toggleWatchLater(video.id))}>
            <Clock className="h-4 w-4" />
            <span>
              {app.watchLater.includes(video.id)
                ? "Remove from Watch later"
                : "Save to Watch later"}
            </span>
          </button>
          <button className="yt-menu-item" onClick={item(() => setModal("save"))}>
            <ListPlus className="h-4 w-4" />
            <span>Save to playlist</span>
          </button>
          <button className="yt-menu-item" onClick={item(() => setModal("share"))}>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <div className="my-1 border-t border-border" />
          <button
            className="yt-menu-item text-destructive hover:text-destructive"
            onClick={item(() => app.hideVideo(video.id))}
          >
            <Ban className="h-4 w-4" />
            <span>Not interested</span>
          </button>
        </div>
      )}
      {modal === "save" && <SaveModal videoId={video.id} onClose={() => setModal(null)} />}
      {modal === "share" && <ShareModal videoId={video.id} onClose={() => setModal(null)} />}
    </div>
  );
}

function Duration({ video }: { video: Video }) {
  return video.isLive ? (
    <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-[#cc0000] px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      LIVE
    </span>
  ) : (
    <span className="absolute bottom-1.5 right-1.5 rounded-[4px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white shadow">
      {video.duration}
    </span>
  );
}

export const VideoCard = memo(function VideoCard({ video }: { video: Video }) {
  const ch = getChannel(video.channelId);
  if (!ch) return null;

  return (
    <div className="group flex flex-col gap-3">
      {/* Thumbnail */}
      <Link
        to="/watch"
        search={{ v: video.id }}
        className="relative block aspect-video w-full overflow-hidden rounded-xl bg-secondary transition-all"
      >
        <Thumbnail
          id={video.id}
          title={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Duration video={video} />
      </Link>

      {/* Details */}
      <div className="flex items-start gap-3 px-0.5">
        <Link to="/channel/$id" params={{ id: ch.id }} className="shrink-0 pt-0.5">
          <ChannelAvatar name={ch.name} tone={ch.tone} size={36} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to="/watch"
            search={{ v: video.id }}
            className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-foreground"
            title={video.title}
          >
            {video.title}
          </Link>
          <Link
            to="/channel/$id"
            params={{ id: ch.id }}
            className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <span className="truncate">{ch.name}</span>
            {ch.verified && <Verified />}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatCount(video.views)} views • {timeAgo(video.uploadDate)}
          </p>
        </div>
        <VideoMenu video={video} />
      </div>
    </div>
  );
});

/** Horizontal list item used by search, recommendations and library pages. */
export function VideoRow({
  video,
  size = "lg",
  showDescription,
  actions,
}: {
  video: Video;
  size?: "sm" | "lg";
  showDescription?: boolean;
  actions?: React.ReactNode;
}) {
  const ch = getChannel(video.channelId);
  if (!ch) return null;

  return (
    <div className="group flex items-start gap-3">
      <Link
        to="/watch"
        search={{ v: video.id }}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-secondary aspect-video",
          size === "lg" ? "w-[40%] max-w-[360px] min-w-[200px]" : "w-[168px]",
        )}
      >
        <Thumbnail
          id={video.id}
          title={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Duration video={video} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to="/watch"
          search={{ v: video.id }}
          className={cn(
            "line-clamp-2 font-medium leading-snug text-foreground hover:text-foreground",
            size === "lg" ? "text-base sm:text-lg" : "text-sm",
          )}
        >
          {video.title}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatCount(video.views)} views • {timeAgo(video.uploadDate)}
        </p>
        <Link
          to="/channel/$id"
          params={{ id: ch.id }}
          className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground",
            size === "lg" ? "my-2" : "mt-1",
          )}
        >
          {size === "lg" && <ChannelAvatar name={ch.name} tone={ch.tone} size={24} />}
          <span className="truncate">{ch.name}</span>
          {ch.verified && <Verified />}
        </Link>
        {showDescription && (
          <p className="mt-2 line-clamp-2 hidden text-xs text-muted-foreground sm:block">
            {video.description}
          </p>
        )}
      </div>
      {actions ?? <VideoMenu video={video} />}
    </div>
  );
}

export function VideoGrid({ videos }: { videos: Video[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}

export function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex animate-pulse flex-col gap-3">
          <div className="aspect-video w-full rounded-xl bg-secondary" />
          <div className="flex gap-3 px-0.5">
            <div className="h-9 w-9 shrink-0 rounded-full bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-4/5 rounded bg-secondary" />
              <div className="h-3 w-1/2 rounded bg-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
