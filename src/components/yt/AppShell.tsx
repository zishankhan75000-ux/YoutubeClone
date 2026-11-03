import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, PlaySquare, Plus, UserSquare, Zap } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app-store";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { MiniSidebar, SidebarContent, SidebarDrawer } from "./Sidebar";

function useIsDesktop() {
  const [d, setD] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const h = () => setD(mq.matches);
    h();
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return d;
}

function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { icon: Home, label: "Home", to: "/" as const },
    { icon: Zap, label: "Shorts", to: "/shorts" as const },
    null,
    { icon: PlaySquare, label: "Subscriptions", to: "/subscriptions" as const },
    { icon: UserSquare, label: "You", to: "/channel/$id" as const, params: { id: "me" } },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border bg-background/95 backdrop-blur md:hidden">
      {items.map((it, i) =>
        it ? (
          <Link
            key={it.label}
            to={it.to as "/"}
            params={("params" in it ? it.params : undefined) as never}
            className={cn(
              "flex flex-col items-center gap-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground",
              path === it.to && "font-semibold text-foreground",
            )}
          >
            <it.icon className="h-5 w-5" />
            <span>{it.label}</span>
          </Link>
        ) : (
          <button
            key={i}
            aria-label="Create"
            onClick={() => toast("Upload or create post — demo action.")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
          >
            <Plus className="h-5 w-5" />
          </button>
        ),
      )}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const app = useApp();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isDesktop = useIsDesktop();
  const overlayMode = path === "/watch" || !isDesktop;
  const [drawer, setDrawer] = useState(false);

  // Hamburger opens a drawer on watch page / small screens, otherwise toggles the full sidebar.
  useEffect(() => {
    if (overlayMode) setDrawer(false);
  }, [path, overlayMode]);

  const toggleHandler = overlayMode ? () => setDrawer((d) => !d) : app.toggleSidebar;
  const showFull = !overlayMode && app.sidebarOpen;
  const showMini = path !== "/watch" && !showFull;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-brand selection:text-brand-foreground">
      <Header onToggleMenu={toggleHandler} />
      <div className="flex">
        {showFull && (
          <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto bg-sidebar scrollbar-none hover:[scrollbar-width:thin]">
            <SidebarContent />
          </aside>
        )}
        {showMini && (
          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[72px] shrink-0 border-r border-border/20 md:block">
            <MiniSidebar />
          </aside>
        )}
        <main className="min-w-0 flex-1 pb-16 md:pb-0">{children}</main>
      </div>
      {overlayMode && <SidebarDrawer open={drawer} onClose={() => setDrawer(false)} />}
      <BottomNav />
    </div>
  );
}
