import { describe, expect, it } from "vitest";
import { videos, getVideo, thumb } from "@/data/videos";
import { channels, getChannel, ME } from "@/data/channels";
import { formatCount, timeAgo, durationSeconds } from "@/lib/format";

describe("YouTube Clone Data & Helpers", () => {
  it("loads the curated catalog of demo videos", () => {
    expect(videos.length).toBeGreaterThan(15);
    const rick = getVideo("dQw4w9WgXcQ");
    expect(rick).toBeDefined();
    expect(rick?.title).toContain("Never Gonna Give You Up");
    expect(rick?.channelId).toBe("rickastley");
  });

  it("resolves channel information including the user's ME channel", () => {
    const meChannel = getChannel("me");
    expect(meChannel).toBeDefined();
    expect(meChannel?.handle).toBe(ME.handle);

    const astleyChannel = getChannel("rickastley");
    expect(astleyChannel).toBeDefined();
    expect(astleyChannel?.name).toBe("Rick Astley");
    expect(astleyChannel?.verified).toBe(true);
  });

  it("formats counts and durations accurately to match YouTube formatting", () => {
    expect(formatCount(1200)).toBe("1.2K");
    expect(formatCount(3500000)).toBe("3.5M");
    expect(formatCount(5200000000)).toBe("5.2B");

    expect(durationSeconds("3:33")).toBe(213);
    expect(durationSeconds("1:00:06")).toBe(3606);

    expect(thumb("dQw4w9WgXcQ")).toBe("https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
  });
});
