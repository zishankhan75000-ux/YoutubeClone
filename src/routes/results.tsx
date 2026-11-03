import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { videos } from "@/data/videos";
import { getChannel } from "@/data/channels";
import { durationSeconds } from "@/lib/format";
import { VideoRow } from "@/components/yt/VideoCard";
import { EmptyState } from "@/components/yt/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s["q"] === "string" ? s["q"] : "",
  }),
  head: ({ match }) => {
    const q = (match.search as { q: string }).q;
    const t = `${q || "Search"} - YouTube Clone`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `Search results for "${q}" on YouTube Clone.` },
        { property: "og:title", content: t },
        { property: "og:description", content: "Search YouTube Clone videos." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Results,
});

const FILTERS = {
  upload: ["Any time", "This year", "Older"],
  type: ["All", "Video", "Live"],
  duration: ["Any", "Under 4 minutes", "4–20 minutes", "Over 20 minutes"],
  sort: ["Relevance", "Upload date", "View count"],
} as const;

function Results() {
  const { q } = Route.useSearch();
  const [show, setShow] = useState(false);
  const [f, setF] = useState({
    upload: "Any time",
    type: "All",
    duration: "Any",
    sort: "Relevance",
  });

  const list = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    let r = videos
      .map((v) => {
        const hay = [v.title, v.description, v.category, getChannel(v.channelId)?.name ?? ""]
          .join(" ")
          .toLowerCase();
        const score = terms.reduce(
          (s, t) => s + (hay.includes(t) ? 1 : 0) + (v.title.toLowerCase().includes(t) ? 2 : 0),
          0,
        );
        return { v, score };
      })
      .filter((x) => (terms.length ? x.score > 0 : true));

    if (f.upload === "This year") r = r.filter((x) => x.v.uploadDate >= "2023-01-01");
    if (f.upload === "Older") r = r.filter((x) => x.v.uploadDate < "2023-01-01");
    if (f.type === "Live") r = r.filter((x) => x.v.isLive);
    if (f.type === "Video") r = r.filter((x) => !x.v.isLive);

    const sec = (x: { v: { duration: string } }) => durationSeconds(x.v.duration);
    if (f.duration === "Under 4 minutes") r = r.filter((x) => sec(x) < 240);
    if (f.duration === "4–20 minutes") r = r.filter((x) => sec(x) >= 240 && sec(x) <= 1200);
    if (f.duration === "Over 20 minutes") r = r.filter((x) => sec(x) > 1200);

    if (f.sort === "Relevance") r.sort((a, b) => b.score - a.score);
    if (f.sort === "Upload date") r.sort((a, b) => b.v.uploadDate.localeCompare(a.v.uploadDate));
    if (f.sort === "View count") r.sort((a, b) => b.v.views - a.v.views);

    return r.map((x) => x.v);
  }, [q, f]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-4 sm:px-6">
      <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
        <p className="text-sm text-muted-foreground">
          About {list.length} results for{" "}
          <span className="font-semibold text-foreground">"{q}"</span>
        </p>
        <button
          className={cn("yt-pill flex items-center gap-2", show && "bg-secondary font-semibold")}
          onClick={() => setShow(!show)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {show && (
        <div className="mb-6 grid grid-cols-2 gap-6 rounded-2xl bg-secondary/30 p-4 border border-border/40 md:grid-cols-4">
          {(Object.keys(FILTERS) as (keyof typeof FILTERS)[]).map((k) => (
            <div key={k}>
              <h3 className="mb-2 border-b border-border/60 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {k === "upload" ? "Upload date" : k === "sort" ? "Sort by" : k}
              </h3>
              <div className="flex flex-col gap-1">
                {FILTERS[k].map((o) => (
                  <button
                    key={o}
                    onClick={() => setF({ ...f, [k]: o })}
                    className={cn(
                      "rounded-lg px-2 py-1 text-left text-sm text-muted-foreground transition-colors hover:text-foreground",
                      f[k] === o && "bg-secondary font-semibold text-foreground",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {list.length ? (
        <div className="flex flex-col gap-4">
          {list.map((v) => (
            <VideoRow key={v.id} video={v} showDescription />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<SearchX className="h-16 w-16" />}
          title="No results found"
          text="Try different search terms or adjust filters."
        />
      )}
    </div>
  );
}
