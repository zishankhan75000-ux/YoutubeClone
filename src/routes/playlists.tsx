import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListVideo, Pencil, Plus, Trash2, X } from "lucide-react";
import { getVideo, type Video } from "@/data/videos";
import { useApp } from "@/context/app-store";
import { VideoRow } from "@/components/yt/VideoCard";
import { EmptyState } from "@/components/yt/primitives";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/playlists")({
  head: () => pageHead("Playlists", "Create and manage your playlists on YouTube Clone."),
  component: Playlists,
});

function Playlists() {
  const app = useApp();
  const [name, setName] = useState("");

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Playlists</h1>
        <p className="mt-1 text-xs text-muted-foreground">Manage your custom video collections</p>
      </div>

      <form
        className="mb-8 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) {
            app.createPlaylist(name.trim());
            setName("");
          }
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name..."
          className="flex-1 rounded-full border border-input bg-secondary px-4 py-2 text-sm outline-none focus:border-link"
        />
        <button className="yt-pill" type="submit">
          <Plus className="h-4 w-4" />
          <span>Create</span>
        </button>
      </form>

      {app.playlists.length === 0 && (
        <EmptyState
          icon={<ListVideo className="h-16 w-16" />}
          title="No playlists yet"
          text="Create a playlist using the box above, or click 'Save' on any video."
        />
      )}

      {app.playlists.map((p) => {
        const vids = p.videoIds.map(getVideo).filter(Boolean) as Video[];
        return (
          <section
            key={p.id}
            className="mb-10 rounded-2xl border border-border/40 bg-secondary/20 p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <h2 className="flex-1 text-lg font-bold">
                {p.name}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  • {vids.length} video{vids.length === 1 ? "" : "s"}
                </span>
              </h2>
              <button
                className="yt-icon-btn h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Rename playlist"
                onClick={() => {
                  const n = prompt("Rename playlist", p.name);
                  if (n?.trim()) app.renamePlaylist(p.id, n.trim());
                }}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                className="yt-icon-btn h-8 w-8 text-muted-foreground hover:text-destructive"
                aria-label="Delete playlist"
                onClick={() => app.deletePlaylist(p.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {vids.length ? (
              <div className="flex flex-col gap-4">
                {vids.map((v) => (
                  <VideoRow
                    key={v.id}
                    video={v}
                    actions={
                      <button
                        className="yt-icon-btn shrink-0 text-muted-foreground hover:text-foreground"
                        aria-label="Remove from playlist"
                        onClick={() => app.togglePlaylistVideo(p.id, v.id)}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="py-4 text-xs text-muted-foreground">
                Empty playlist — click "Save" on any video card to add it here.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
