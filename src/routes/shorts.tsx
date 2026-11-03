import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Music2,
  Share2,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { shorts } from "@/data/videos";
import { getChannel } from "@/data/channels";
import { formatCount } from "@/lib/format";
import { useApp } from "@/context/app-store";
import { ChannelAvatar, Modal } from "@/components/yt/primitives";
import { ShareModal } from "@/components/yt/SaveMenu";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shorts")({
  head: () => pageHead("Shorts", "Watch popular Shorts on YouTube Clone."),
  component: Shorts,
});

function Action({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 text-xs font-semibold">
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md transition-colors hover:bg-accent",
          active && "bg-foreground text-background hover:bg-foreground/90",
        )}
      >
        {icon}
      </span>
      <span className="text-foreground">{label}</span>
    </button>
  );
}

function ShortsCommentsModal({ onClose, title }: { onClose: () => void; title: string }) {
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([
    {
      id: "1",
      user: "@creator_fan",
      text: "This short is incredible! 🔥",
      time: "2h ago",
      likes: 34,
    },
    {
      id: "2",
      user: "@musiclover",
      text: "The audio transition here is so clean.",
      time: "5h ago",
      likes: 18,
    },
    {
      id: "3",
      user: "@tech_enthusiast",
      text: "Can't stop replaying this!",
      time: "1d ago",
      likes: 9,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList([
      {
        id: Date.now().toString(),
        user: "@demo-user",
        text: commentText.trim(),
        time: "Just now",
        likes: 0,
      },
      ...commentsList,
    ]);
    setCommentText("");
    toast("Comment posted to Short");
  };

  return (
    <Modal title={`Comments • ${title}`} onClose={onClose}>
      <div className="flex max-h-[60vh] flex-col">
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment on this short..."
            className="flex-1 rounded-full border border-input bg-secondary px-4 py-2 text-xs outline-none focus:border-link"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="rounded-full bg-link px-4 py-2 text-xs font-semibold text-brand-foreground disabled:opacity-50"
          >
            Post
          </button>
        </form>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {commentsList.map((c) => (
            <div key={c.id} className="rounded-lg bg-secondary/40 p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{c.user}</span>
                <span className="text-muted-foreground">{c.time}</span>
              </div>
              <p className="mt-1 text-foreground/90">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function Shorts() {
  const app = useApp();
  const [i, setI] = useState(0);
  const [share, setShare] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const s = shorts[i]!;
  const ch = getChannel(s.channelId)!;
  const go = (d: number) => setI((x) => Math.min(shorts.length - 1, Math.max(0, x + d)));

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") go(1);
      if (e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const [touchY, setTouchY] = useState<number | null>(null);
  const liked = app.liked.includes(s.id);
  const subscribed = app.subscriptions.includes(ch.id);

  return (
    <div className="flex h-[calc(100vh-3.5rem-3.5rem)] items-center justify-center gap-4 py-2 md:h-[calc(100vh-3.5rem)]">
      <div className="flex h-full items-end gap-3 sm:gap-4">
        {/* Vertical Video Viewport */}
        <div
          className="relative h-full max-h-[820px] overflow-hidden rounded-2xl bg-black shadow-2xl"
          style={{ aspectRatio: "9 / 16" }}
          onTouchStart={(e) => setTouchY(e.touches[0]!.clientY)}
          onTouchEnd={(e) => {
            if (touchY === null) return;
            const d = touchY - e.changedTouches[0]!.clientY;
            if (Math.abs(d) > 50) go(d > 0 ? 1 : -1);
            setTouchY(null);
          }}
        >
          <iframe
            key={s.id}
            className="absolute left-1/2 top-0 h-full -translate-x-1/2 border-0"
            style={{ aspectRatio: "16 / 9" }}
            src={`https://www.youtube-nocookie.com/embed/${s.id}?autoplay=1&loop=1&playlist=${s.id}&controls=1&rel=0&modestbranding=1`}
            title={s.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />

          {/* Top badge */}
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            Short {i + 1} of {shorts.length}
          </span>

          {/* Bottom Overlay Info */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-16 text-white">
            <div className="pointer-events-auto flex items-center gap-2">
              <Link
                to="/channel/$id"
                params={{ id: ch.id }}
                className="flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                <ChannelAvatar name={ch.name} tone={ch.tone} size={32} />
                <span>{ch.handle}</span>
              </Link>
              <button
                onClick={() => app.toggleSubscribe(ch.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  subscribed
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-white text-black hover:bg-white/90",
                )}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-snug font-medium text-white/95">
              {s.title}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/80">
              <Music2 className="h-3 w-3 shrink-0" />
              <span className="truncate">Original audio • {ch.name}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons (Right Side) */}
        <div className="flex flex-col gap-3 pb-2">
          <Action
            icon={<ThumbsUp className={cn("h-5 w-5", liked && "fill-current text-foreground")} />}
            label={formatCount(s.likes + (liked ? 1 : 0))}
            onClick={() => app.toggleLike(s.id)}
            active={liked}
          />
          <Action
            icon={<ThumbsDown className="h-5 w-5" />}
            label="Dislike"
            onClick={() => app.toggleDislike(s.id)}
            active={app.disliked.includes(s.id)}
          />
          <Action
            icon={<MessageSquare className="h-5 w-5" />}
            label="Comments"
            onClick={() => setCommentsOpen(true)}
          />
          <Action
            icon={<Share2 className="h-5 w-5" />}
            label="Share"
            onClick={() => setShare(true)}
          />
        </div>
      </div>

      {/* Up/Down Desktop Switcher */}
      <div className="hidden flex-col gap-3 md:flex">
        <button
          className="yt-icon-btn h-12 w-12 bg-secondary transition-opacity hover:bg-accent disabled:opacity-30"
          disabled={i === 0}
          onClick={() => go(-1)}
          aria-label="Previous short"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
        <button
          className="yt-icon-btn h-12 w-12 bg-secondary transition-opacity hover:bg-accent disabled:opacity-30"
          disabled={i === shorts.length - 1}
          onClick={() => go(1)}
          aria-label="Next short"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>

      {share && <ShareModal videoId={s.id} onClose={() => setShare(false)} />}
      {commentsOpen && (
        <ShortsCommentsModal title={s.title} onClose={() => setCommentsOpen(false)} />
      )}
    </div>
  );
}
