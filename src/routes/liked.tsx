import { createFileRoute } from "@tanstack/react-router";
import { ThumbsUp, X } from "lucide-react";
import { getVideo, type Video } from "@/data/videos";
import { useApp } from "@/context/app-store";
import { VideoRow } from "@/components/yt/VideoCard";
import { EmptyState } from "@/components/yt/primitives";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/liked")({
  head: () => pageHead("Liked videos", "Videos you've liked on YouTube Clone."),
  component: Page,
});

function Page() {
  const app = useApp();
  const list = app.liked.map(getVideo).filter(Boolean) as Video[];

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Liked videos</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {list.length} video{list.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      {list.length ? (
        <div className="flex flex-col gap-4">
          {list.map((v) => (
            <VideoRow
              key={v.id}
              video={v}
              showDescription
              actions={
                <button
                  className="yt-icon-btn shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Remove from Liked videos"
                  onClick={() => app.toggleLike(v.id)}
                >
                  <X className="h-5 w-5" />
                </button>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ThumbsUp className="h-16 w-16" />}
          title="No liked videos yet"
          text="Give videos a thumbs up to see them listed here in your library."
        />
      )}
    </div>
  );
}
