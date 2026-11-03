export interface DemoComment {
  id: string;
  author: string;
  text: string;
  likes: number;
  ago: string;
  tone: 1 | 2 | 3 | 4 | 5;
}

const pool: Omit<DemoComment, "id">[] = [
  {
    author: "@pixelwanderer",
    text: "Came back to this after years and it still hits exactly the same.",
    likes: 12400,
    ago: "2 weeks ago",
    tone: 1,
  },
  {
    author: "@morningcoffee_dev",
    text: "The way this was put together is genuinely impressive. Every second is intentional.",
    likes: 3800,
    ago: "1 month ago",
    tone: 2,
  },
  {
    author: "@sana.k",
    text: "Watching this at 2am instead of sleeping. No regrets.",
    likes: 920,
    ago: "3 days ago",
    tone: 3,
  },
  {
    author: "@trailrunner88",
    text: "Whoever is reading this, I hope your day gets better 💛",
    likes: 25100,
    ago: "6 months ago",
    tone: 4,
  },
  {
    author: "@lofi_lena",
    text: "Bookmarking this so I can show it to my students tomorrow.",
    likes: 210,
    ago: "5 hours ago",
    tone: 5,
  },
  {
    author: "@arjun_builds",
    text: "Timestamp 1:12 is where it all clicked for me.",
    likes: 1500,
    ago: "1 year ago",
    tone: 1,
  },
  {
    author: "@quietkeys",
    text: "The quality of this is unreal for the time it was made.",
    likes: 640,
    ago: "8 months ago",
    tone: 3,
  },
];

/** Demo comments only — these are not real comments from any platform. */
export function commentsFor(videoId: string): DemoComment[] {
  const seed = [...videoId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const n = 4 + (seed % 3);
  return Array.from({ length: n }, (_, i) => ({
    ...pool[(seed + i) % pool.length]!,
    id: `${videoId}-${i}`,
  }));
}
