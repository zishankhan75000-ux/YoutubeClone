import { useEffect, useMemo, useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Tv } from "lucide-react";
import { videos } from "@/data/videos";
import { useApp } from "@/context/app-store";
import { VideoGrid, VideoGridSkeleton } from "@/components/yt/VideoCard";
import { EmptyState } from "@/components/yt/primitives";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Home",
      "Watch trending music, gaming, news, tech talks, courses and more on YouTube Clone.",
    ),
  component: Home,
});

const CHIPS = [
  "All",
  "Music",
  "Gaming",
  "Live",
  "News",
  "Podcasts",
  "Technology",
  "Cricket",
  "Football",
  "Education",
  "Comedy",
  "Recently uploaded",
  "Watched",
];

function Home() {
  const app = useApp();
  const [chip, setChip] = useState("All");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, [chip]);

  const list = useMemo(() => {
    const visible = videos.filter((v) => !app.hidden.includes(v.id));
    if (chip === "All") return visible;
    if (chip === "Watched") return visible.filter((v) => app.history.includes(v.id));
    if (chip === "Recently uploaded")
      return [...visible].sort((a, b) => b.uploadDate.localeCompare(a.uploadDate)).slice(0, 8);
    return visible.filter((v) => v.category === chip);
  }, [chip, app.hidden, app.history]);

  const scroll = (d: number) => scroller.current?.scrollBy({ left: d * 300, behavior: "smooth" });

  return (
    <div className="px-4 sm:px-6">
      {/* Category Pills Scroller */}
      <div className="sticky top-14 z-30 -mx-4 flex items-center bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <button
          className="yt-icon-btn mr-1 hidden shrink-0 sm:inline-flex"
          aria-label="Scroll left"
          onClick={() => scroll(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div ref={scroller} className="flex flex-1 gap-2.5 overflow-x-auto scrollbar-none py-0.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setChip(c)}
              className={cn("yt-chip", chip === c && "yt-chip-active")}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          className="yt-icon-btn ml-1 hidden shrink-0 sm:inline-flex"
          aria-label="Scroll right"
          onClick={() => scroll(1)}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Videos Grid */}
      <div className="pb-12 pt-2">
        {loading ? (
          <VideoGridSkeleton />
        ) : list.length ? (
          <VideoGrid videos={list} />
        ) : (
          <EmptyState
            icon={<Tv className="h-16 w-16" />}
            title="Nothing here yet"
            text={
              chip === "Watched"
                ? "Videos you watch will show up here."
                : "No videos found in this category. Try selecting another filter chip above."
            }
          />
        )}
      </div>
    </div>
  );
}
