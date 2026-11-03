import { useState } from "react";
import { Check, Clock, Plus } from "lucide-react";
import { useApp } from "@/context/app-store";
import { Modal } from "./primitives";

export function SaveModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const app = useApp();
  const [name, setName] = useState("");
  return (
    <Modal title="Save video to…" onClose={onClose}>
      <div className="flex flex-col">
        <button className="yt-menu-item rounded-lg" onClick={() => app.toggleWatchLater(videoId)}>
          <span className="flex h-5 w-5 items-center justify-center rounded border border-input">
            {app.watchLater.includes(videoId) && <Check className="h-4 w-4" />}
          </span>
          <Clock className="h-4 w-4" /> Watch later
        </button>
        {app.playlists.map((p) => (
          <button
            key={p.id}
            className="yt-menu-item rounded-lg"
            onClick={() => app.togglePlaylistVideo(p.id, videoId)}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded border border-input">
              {p.videoIds.includes(videoId) && <Check className="h-4 w-4" />}
            </span>
            {p.name}
          </button>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          app.createPlaylist(name.trim(), videoId);
          setName("");
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring"
        />
        <button className="yt-pill" type="submit">
          <Plus className="h-4 w-4" /> Create
        </button>
      </form>
    </Modal>
  );
}

export function ShareModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/watch?v=${videoId}`
      : `/watch?v=${videoId}`;
  const [copied, setCopied] = useState(false);
  return (
    <Modal title="Share" onClose={onClose}>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary p-2">
        <input readOnly value={url} className="flex-1 bg-transparent px-2 text-sm outline-none" />
        <button
          className="rounded-full bg-link px-4 py-2 text-sm font-medium text-brand-foreground"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
            } catch {
              /* clipboard blocked */
            }
            setCopied(true);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </Modal>
  );
}
