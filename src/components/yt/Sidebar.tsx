import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Flag,
  Flame,
  Gamepad2,
  HelpCircle,
  History,
  Home,
  ListVideo,
  Menu,
  MessageSquareWarning,
  Mic2,
  Music2,
  Newspaper,
  PlaySquare,
  Settings,
  ThumbsUp,
  Trophy,
  UserSquare,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/context/app-store";
import { getChannel } from "@/data/channels";
import { cn } from "@/lib/utils";
import { ChannelAvatar, Logo, Modal } from "./primitives";
import { toast } from "sonner";

type Item = {
  icon: LucideIcon;
  label: string;
  to: string;
  params?: Record<string, string>;
};

const main: Item[] = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Zap, label: "Shorts", to: "/shorts" },
  { icon: PlaySquare, label: "Subscriptions", to: "/subscriptions" },
];

const you: Item[] = [
  { icon: UserSquare, label: "Your channel", to: "/channel/$id", params: { id: "me" } },
  { icon: History, label: "History", to: "/history" },
  { icon: ListVideo, label: "Playlists", to: "/playlists" },
  { icon: PlaySquare, label: "Your videos", to: "/channel/$id", params: { id: "me" } },
  { icon: Clock, label: "Watch later", to: "/watch-later" },
  { icon: ThumbsUp, label: "Liked videos", to: "/liked" },
];

const explore: Item[] = [
  { icon: Flame, label: "Trending", to: "/explore/$category", params: { category: "trending" } },
  { icon: Music2, label: "Music", to: "/explore/$category", params: { category: "music" } },
  { icon: Gamepad2, label: "Gaming", to: "/explore/$category", params: { category: "gaming" } },
  { icon: Newspaper, label: "News", to: "/explore/$category", params: { category: "news" } },
  { icon: Trophy, label: "Sports", to: "/explore/$category", params: { category: "sports" } },
  { icon: Mic2, label: "Podcasts", to: "/explore/$category", params: { category: "podcasts" } },
];

function useIsActive() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (it: Item) => {
    let href = it.to;
    for (const [k, v] of Object.entries(it.params ?? {})) {
      href = href.replace(`$${k}`, v);
    }
    return href === path;
  };
}

function NavItem({
  it,
  active,
  onNavigate,
}: {
  it: Item;
  active: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const I = it.icon;
  return (
    <Link
      to={it.to as "/"}
      params={it.params as never}
      onClick={onNavigate}
      className={cn(
        "flex h-10 items-center gap-6 rounded-xl px-3 text-sm transition-colors hover:bg-sidebar-accent",
        active && "bg-sidebar-accent font-medium text-foreground",
      )}
    >
      <I className={cn("h-5 w-5 shrink-0", active && "text-foreground")} />
      <span className="truncate">{it.label}</span>
    </Link>
  );
}

function Section({ title, children }: { title?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border-b border-sidebar-border px-3 py-2.5">
      {title && (
        <div className="flex items-center gap-1 px-3 pb-1 pt-1 text-sm font-semibold text-foreground">
          {title}
        </div>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const app = useApp();
  const isActive = useIsActive();
  const [showAll, setShowAll] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const subs = app.subscriptions.map(getChannel).filter(Boolean);
  const visible = showAll ? subs : subs.slice(0, 6);

  return (
    <nav className="pb-8 text-sidebar-foreground">
      <Section>
        {main.map((it) => (
          <NavItem key={it.label} it={it} active={isActive(it)} onNavigate={onNavigate} />
        ))}
      </Section>

      <Section
        title={
          <Link
            to="/subscriptions"
            onClick={onNavigate}
            className="flex items-center gap-1 hover:text-foreground hover:underline"
          >
            <span>Subscriptions</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        }
      >
        {visible.map((c) => (
          <Link
            key={c!.id}
            to="/channel/$id"
            params={{ id: c!.id }}
            onClick={onNavigate}
            className="flex h-10 items-center gap-6 rounded-xl px-3 text-sm transition-colors hover:bg-sidebar-accent"
          >
            <ChannelAvatar name={c!.name} tone={c!.tone} size={24} />
            <span className="flex-1 truncate">{c!.name}</span>
            <span className="h-1 w-1 rounded-full bg-link" />
          </Link>
        ))}
        {subs.length > 6 && (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="flex h-10 w-full items-center gap-6 rounded-xl px-3 text-sm hover:bg-sidebar-accent"
          >
            {showAll ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            {showAll ? "Show fewer" : `Show ${subs.length - 6} more`}
          </button>
        )}
        {subs.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted-foreground">No subscriptions yet</p>
        )}
      </Section>

      <Section
        title={
          <Link
            to="/channel/$id"
            params={{ id: "me" }}
            onClick={onNavigate}
            className="flex items-center gap-1 hover:text-foreground hover:underline"
          >
            <span>You</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        }
      >
        {you.map((it) => (
          <NavItem
            key={it.label}
            it={it}
            active={isActive(it) && it.label !== "Your videos"}
            onNavigate={onNavigate}
          />
        ))}
      </Section>

      <Section title={<span>Explore</span>}>
        {explore.map((it) => (
          <NavItem key={it.label} it={it} active={isActive(it)} onNavigate={onNavigate} />
        ))}
      </Section>

      <Section>
        <NavItem
          it={{ icon: Settings, label: "Settings", to: "/settings" }}
          active={isActive({ icon: Settings, label: "", to: "/settings" })}
          onNavigate={onNavigate}
        />
        <NavItem
          it={{ icon: Flag, label: "Report history", to: "/help" }}
          active={false}
          onNavigate={onNavigate}
        />
        <NavItem
          it={{ icon: HelpCircle, label: "Help", to: "/help" }}
          active={isActive({ icon: HelpCircle, label: "", to: "/help" })}
          onNavigate={onNavigate}
        />
        <button
          onClick={() => setFeedback(true)}
          className="flex h-10 w-full items-center gap-6 rounded-xl px-3 text-sm hover:bg-sidebar-accent"
        >
          <MessageSquareWarning className="h-5 w-5" />
          <span>Send feedback</span>
        </button>
      </Section>

      <div className="px-6 pt-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground/80">YouTube Clone</p>
        <p className="mt-1 leading-relaxed">
          Educational recreation built with React, Vite, and Tailwind CSS. All mock data and video
          actions persist locally in your browser.
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground/70">© 2026 YouTube Clone Demo</p>
      </div>

      {feedback && <FeedbackModal onClose={() => setFeedback(false)} />}
    </nav>
  );
}

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  return (
    <Modal title="Send feedback" onClose={onClose}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Tell us what you think of this YouTube Clone (demo feedback saved locally)..."
        className="w-full rounded-lg border border-input bg-transparent p-3 text-sm outline-none focus:border-ring"
      />
      <div className="mt-3 flex justify-end">
        <button
          disabled={!text.trim()}
          className="rounded-full bg-link px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity disabled:opacity-50"
          onClick={() => {
            toast("Thank you for your feedback! (Demo feedback acknowledged)");
            onClose();
          }}
        >
          Send
        </button>
      </div>
    </Modal>
  );
}

export function MiniSidebar() {
  const isActive = useIsActive();
  const items: Item[] = [
    ...main,
    { icon: UserSquare, label: "You", to: "/channel/$id", params: { id: "me" } },
  ];
  return (
    <nav className="flex flex-col gap-1 px-1 pt-1">
      {items.map((it) => {
        const I = it.icon;
        const active = isActive(it);
        return (
          <Link
            key={it.label}
            to={it.to as "/"}
            params={it.params as never}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl py-3.5 text-[10px] transition-colors hover:bg-sidebar-accent",
              active && "font-medium text-foreground",
            )}
          >
            <I className="h-6 w-6" />
            <span className="truncate">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={cn("fixed inset-0 z-50 transition-opacity", !open && "pointer-events-none")}>
      <div
        className={cn(
          "absolute inset-0 bg-overlay/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 w-60 overflow-y-auto bg-sidebar shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center gap-4 px-4">
          <button className="yt-icon-btn" aria-label="Close menu" onClick={onClose}>
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" onClick={onClose} className="flex items-center">
            <Logo />
          </Link>
        </div>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
