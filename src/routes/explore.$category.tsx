import { createFileRoute, notFound } from "@tanstack/react-router";
import { Flame, Gamepad2, Mic2, Music2, Newspaper, Trophy } from "lucide-react";
import { videos } from "@/data/videos";
import { VideoRow } from "@/components/yt/VideoCard";
import { EmptyState } from "@/components/yt/primitives";

const CATS = {
  trending: {
    title: "Trending",
    icon: Flame,
    filter: () => [...videos].sort((a, b) => b.views - a.views),
  },
  music: {
    title: "Music",
    icon: Music2,
    filter: () => videos.filter((v) => v.category === "Music"),
  },
  gaming: {
    title: "Gaming",
    icon: Gamepad2,
    filter: () => videos.filter((v) => ["Gaming", "Technology"].includes(v.category)),
  },
  news: {
    title: "News",
    icon: Newspaper,
    filter: () => videos.filter((v) => ["News", "Live"].includes(v.category)),
  },
  sports: {
    title: "Sports",
    icon: Trophy,
    filter: () => videos.filter((v) => ["Cricket", "Football"].includes(v.category)),
  },
  podcasts: {
    title: "Podcasts",
    icon: Mic2,
    filter: () => videos.filter((v) => ["Podcasts", "Education"].includes(v.category)),
  },
} as const;

export const Route = createFileRoute("/explore/$category")({
  loader: ({ params }) => {
    if (!(params.category in CATS)) throw notFound();
  },
  head: ({ params }) => {
    const c = CATS[params.category as keyof typeof CATS];
    const t = `${c?.title ?? "Explore"} - YouTube Clone`;
    const d = `Explore trending ${c?.title.toLowerCase() ?? ""} videos on YouTube Clone.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Explore,
});

function Explore() {
  const { category } = Route.useParams();
  const c = CATS[category as keyof typeof CATS];
  const list = c.filter();
  const Icon = c.icon;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg">
          <Icon className="h-8 w-8" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.title}</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Top trending and popular {c.title.toLowerCase()} content
          </p>
        </div>
      </div>
      {list.length ? (
        <div className="flex flex-col gap-4">
          {list.map((v, i) => (
            <div key={v.id} className="flex items-start gap-4">
              <span className="hidden w-6 pt-3 text-right text-lg font-bold text-muted-foreground sm:block">
                {i + 1}
              </span>
              <div className="flex-1">
                <VideoRow video={v} showDescription />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Icon className="h-16 w-16" />}
          title="Nothing here yet"
          text="No videos currently listed in this category."
        />
      )}
    </div>
  );
}
