import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Download,
  EllipsisVertical,
  Flag,
  ListPlus,
  Share2,
  ThumbsDown,
  ThumbsUp,
  ArrowUpDown,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { getVideo, videos } from "@/data/videos";
import { getChannel, ME } from "@/data/channels";
import { commentsFor } from "@/data/comments";
import { formatCount, timeAgo } from "@/lib/format";
import { useApp } from "@/context/app-store";
import { VideoRow } from "@/components/yt/VideoCard";
import { ChannelAvatar, EmptyState, Verified, useDismiss } from "@/components/yt/primitives";
import { SaveModal, ShareModal } from "@/components/yt/SaveMenu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watch")({
  validateSearch: (s: Record<string, unknown>) => ({
    v: typeof s["v"] === "string" ? s["v"] : "",
  }),
  head: ({ match }) => {
    const v = getVideo((match.search as { v: string }).v);
    const t = v ? `${v.title} - YouTube Clone` : "Video unavailable - YouTube Clone";
    const d = v?.description ?? "Watch this video on YouTube Clone.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "video.other" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(v
          ? [
              { property: "og:image", content: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` },
              { name: "twitter:image", content: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` },
            ]
          : []),
      ],
    };
  },
  component: Watch,
});

function Player({ id, title }: { id: string; title: string }) {
  const [offline, setOffline] = useState(false);
  useEffect(() => setOffline(typeof navigator !== "undefined" && !navigator.onLine), []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
      {offline ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-white">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
          <span>You are offline — this video player cannot load.</span>
        </div>
      ) : (
        <iframe
          key={id}
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}

function Comments({ videoId }: { videoId: string }) {
  const app = useApp();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [sort, setSort] = useState<"top" | "new">("top");
  const [liked, setLiked] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const demo = useMemo(() => commentsFor(videoId), [videoId]);
  const mine = app.comments
    .filter((c) => c.videoId === videoId)
    .map((c) => ({
      id: c.id,
      author: ME.handle,
      text: c.text,
      likes: 0,
      ago: "Just now",
      tone: ME.tone,
    }));

  const sorted =
    sort === "top" ? [...mine, ...[...demo].sort((a, b) => b.likes - a.likes)] : [...mine, ...demo];

  return (
    <section className="mt-6 border-t border-border/40 pt-6">
      <div className="mb-6 flex items-center gap-8">
        <h2 className="text-xl font-bold tracking-tight">{sorted.length} Comments</h2>
        <button
          className="flex items-center gap-2 text-sm font-semibold hover:text-foreground/80"
          onClick={() => setSort(sort === "top" ? "new" : "top")}
        >
          <ArrowUpDown className="h-4 w-4" />
          <span>Sort by: {sort === "top" ? "Top comments" : "Newest first"}</span>
        </button>
      </div>

      {/* Add comment box */}
      <form
        className="mb-8 flex items-start gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          app.addComment(videoId, text.trim());
          setText("");
          setFocused(false);
          toast("Comment posted successfully");
        }}
      >
        <ChannelAvatar name={ME.name} tone={ME.tone} size={40} className="shrink-0" />
        <div className="flex-1">
          <input
            value={text}
            onFocus={() => setFocused(true)}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border-b border-input bg-transparent pb-1 text-sm outline-none transition-colors focus:border-foreground"
          />
          {focused && (
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm font-medium hover:bg-secondary"
                onClick={() => {
                  setFocused(false);
                  setText("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="rounded-full bg-link px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-60"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments list */}
      <ul className="flex flex-col gap-6">
        {sorted.map((c) => {
          const isLiked = liked.includes(c.id);
          return (
            <li key={c.id} className="flex items-start gap-3.5">
              <ChannelAvatar name={c.author} tone={c.tone} size={40} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-foreground">{c.author}</span>
                  <span className="text-muted-foreground">{c.ago}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{c.text}</p>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <button
                    aria-label="Like comment"
                    className="yt-icon-btn h-8 w-8 hover:bg-secondary"
                    onClick={() =>
                      setLiked((l) => (isLiked ? l.filter((x) => x !== c.id) : [...l, c.id]))
                    }
                  >
                    <ThumbsUp
                      className={cn("h-3.5 w-3.5", isLiked && "fill-current text-foreground")}
                    />
                  </button>
                  <span className="text-xs font-medium">
                    {formatCount(c.likes + (isLiked ? 1 : 0)) !== "0" &&
                      formatCount(c.likes + (isLiked ? 1 : 0))}
                  </span>
                  <button
                    aria-label="Dislike comment"
                    className="yt-icon-btn h-8 w-8 hover:bg-secondary"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="rounded-full px-3 py-1 font-semibold text-foreground hover:bg-secondary"
                    onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                  >
                    Reply
                  </button>
                </div>
                {replyTo === c.id && (
                  <form
                    className="mt-3 flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      toast("Reply posted (demo simulation)");
                      setReplyTo(null);
                    }}
                  >
                    <input
                      autoFocus
                      placeholder={`Reply to ${c.author}...`}
                      className="flex-1 border-b border-input bg-transparent pb-1 text-xs outline-none focus:border-foreground"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-link px-3 py-1 text-xs font-semibold text-brand-foreground"
                    >
                      Reply
                    </button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function MoreMenu({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button
        className="yt-icon-btn bg-secondary hover:bg-accent"
        aria-label="More"
        onClick={() => setOpen(!open)}
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>
      {open && (
        <div className="yt-menu right-0 top-12">
          <button
            className="yt-menu-item"
            onClick={() => {
              toast("Thanks for reporting — submitted to demo moderation.");
              setOpen(false);
            }}
          >
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </button>
          <a
            className="yt-menu-item flex items-center gap-3"
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open on YouTube.com</span>
          </a>
        </div>
      )}
    </div>
  );
}

function Watch() {
  const { v } = Route.useSearch();
  const app = useApp();
  const video = getVideo(v);
  const [modal, setModal] = useState<"share" | "save" | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { addHistory } = app;

  useEffect(() => {
    if (video) addHistory(video.id);
    setExpanded(false);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

  if (!video)
    return (
      <EmptyState
        icon={<AlertTriangle className="h-16 w-16" />}
        title="Video unavailable"
        text="This video does not exist in the YouTube Clone catalog."
      >
        <Link to="/" className="yt-pill">
          Go back to Home
        </Link>
      </EmptyState>
    );

  const ch = getChannel(video.channelId)!;
  const liked = app.liked.includes(video.id);
  const disliked = app.disliked.includes(video.id);
  const subscribed = app.subscriptions.includes(ch.id);
  const related = videos
    .filter((x) => x.id !== video.id)
    .sort((a, b) => Number(b.category === video.category) - Number(a.category === video.category));

  return (
    <div className="mx-auto flex max-w-[1750px] flex-col gap-6 px-3 pt-3 sm:px-6 sm:pt-6 lg:flex-row">
      {/* Primary Video Column */}
      <div className="min-w-0 flex-1">
        <Player id={video.id} title={video.title} />

        <div className="px-1 pt-3 sm:px-0">
          <h1 className="text-lg font-bold leading-snug sm:text-xl">{video.title}</h1>

          {/* Action row: Channel info on left, like/dislike/share/save on right */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <Link to="/channel/$id" params={{ id: ch.id }} className="shrink-0">
                <ChannelAvatar name={ch.name} tone={ch.tone} size={40} />
              </Link>
              <div className="min-w-0">
                <Link
                  to="/channel/$id"
                  params={{ id: ch.id }}
                  className="flex items-center gap-1 font-semibold text-foreground hover:underline"
                >
                  <span className="truncate">{ch.name}</span>
                  {ch.verified && <Verified />}
                </Link>
                <p className="text-xs text-muted-foreground">{ch.subscribers} subscribers</p>
              </div>
              <button
                onClick={() => app.toggleSubscribe(ch.id)}
                className={cn(
                  "ml-3 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  subscribed
                    ? "bg-secondary text-secondary-foreground hover:bg-accent"
                    : "bg-foreground text-background hover:bg-foreground/90",
                )}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {/* Joined Like / Dislike pill */}
              <div className="flex shrink-0 items-center overflow-hidden rounded-full bg-secondary">
                <button
                  onClick={() => app.toggleLike(video.id)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold hover:bg-accent"
                  aria-pressed={liked}
                >
                  <ThumbsUp className={cn("h-4 w-4", liked && "fill-current text-foreground")} />
                  <span>{formatCount(video.likes + (liked ? 1 : 0))}</span>
                </button>
                <span className="h-5 w-px bg-border" />
                <button
                  onClick={() => app.toggleDislike(video.id)}
                  className="px-3.5 py-2 text-xs hover:bg-accent"
                  aria-label="Dislike"
                  aria-pressed={disliked}
                >
                  <ThumbsDown
                    className={cn("h-4 w-4", disliked && "fill-current text-foreground")}
                  />
                </button>
              </div>

              <button className="yt-pill shrink-0" onClick={() => setModal("share")}>
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button
                className="yt-pill shrink-0"
                onClick={() => toast("Offline download simulation: video cached in browser.")}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button className="yt-pill shrink-0" onClick={() => setModal("save")}>
                <ListPlus className="h-4 w-4" />
                <span>Save</span>
              </button>
              <MoreMenu id={video.id} />
            </div>
          </div>

          {/* Description Box */}
          <div
            onClick={() => setExpanded(!expanded)}
            className="mt-4 cursor-pointer rounded-xl bg-secondary/80 p-3.5 text-left text-sm transition-colors hover:bg-secondary"
          >
            <div className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
              <span>{formatCount(video.views)} views</span>
              <span>•</span>
              <span>{timeAgo(video.uploadDate)}</span>
              <span className="text-link">#{video.category.replace(/\s/g, "")}</span>
            </div>
            <p
              className={cn(
                "mt-2 whitespace-pre-line text-foreground/90",
                !expanded && "line-clamp-2",
              )}
            >
              {video.description}
              {expanded &&
                `\n\nCategory: ${video.category}\nPlaying via YouTube's official embedded player.`}
            </p>
            <button
              type="button"
              className="mt-2 block font-semibold text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? "Show less" : "...more"}
            </button>
          </div>

          {/* Comments for desktop layout */}
          <div className="hidden lg:block">
            <Comments videoId={video.id} />
          </div>
        </div>
      </div>

      {/* Recommended Videos Sidebar */}
      <aside className="flex w-full flex-col gap-3 px-1 sm:px-0 lg:w-[402px] lg:shrink-0">
        <h2 className="text-sm font-semibold text-muted-foreground lg:hidden">Related videos</h2>
        {related.map((r) => (
          <VideoRow key={r.id} video={r} size="sm" />
        ))}
      </aside>

      {/* Comments for mobile layout */}
      <div className="px-1 lg:hidden">
        <Comments videoId={video.id} />
      </div>

      {modal === "share" && <ShareModal videoId={video.id} onClose={() => setModal(null)} />}
      {modal === "save" && <SaveModal videoId={video.id} onClose={() => setModal(null)} />}
    </div>
  );
}
