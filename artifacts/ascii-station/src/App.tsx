import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Expand, Minimize, Radio, ShieldAlert, VolumeX } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!frameRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (frameRef.current.requestFullscreen) {
        await frameRef.current.requestFullscreen();
      }
    } catch {
      setIsFullscreen(false);
    }
  };

  return (
    <main className="station-shell station-gridline text-foreground">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1680px] flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
        <header className="station-header mb-5 flex items-start justify-between gap-5 border-b border-border/70 pb-4 sm:mb-7 sm:pb-5">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-primary/50 bg-primary/10 text-primary shadow-[inset_0_0_18px_hsl(var(--primary)/.12)] sm:h-11 sm:w-11">
              <span className="font-mono text-lg font-medium leading-none sm:text-xl">L</span>
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[.22em] text-muted-foreground sm:text-[11px]">
                <span>LEVIATHAN / DECK 04</span>
                <span className="hidden text-primary/70 sm:inline">·</span>
                <span className="text-accent">SIGNAL UNSTABLE</span>
              </div>
              <h1 className="station-flicker truncate font-sans text-xl font-semibold tracking-[-.03em] text-foreground sm:text-3xl">
                ASCII Station
              </h1>
              <p className="mt-1 max-w-xl font-mono text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
                An abandoned vessel is still answering the radio.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-5 pt-1 sm:flex">
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">Hull status</div>
              <div className="mt-1 flex items-center justify-end gap-2 font-mono text-[11px] text-accent">
                <span className="station-signal h-1.5 w-1.5 rounded-full bg-accent" />
                <span>DEGRADING</span>
              </div>
            </div>
            <div className="h-8 w-px bg-border/80" />
            <Radio className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
          </div>
        </header>

        <section className="station-display flex flex-1 flex-col" aria-labelledby="game-heading">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_9px_hsl(var(--primary)/.7)]" />
              <h2 id="game-heading" className="truncate font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground sm:text-[11px]">
                Live navigation feed
              </h2>
              <span className="hidden font-mono text-[10px] text-border sm:inline">/</span>
              <span className="hidden font-mono text-[10px] text-muted-foreground/60 sm:inline">LOCAL LINK 07</span>
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="group inline-flex shrink-0 items-center gap-2 border border-border bg-card/80 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground transition-colors hover:border-primary/70 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={isFullscreen ? 'Exit fullscreen game view' : 'Enter fullscreen game view'}
              aria-pressed={isFullscreen}
            >
              {isFullscreen ? <Minimize className="h-3.5 w-3.5" aria-hidden="true" /> : <Expand className="h-3.5 w-3.5" aria-hidden="true" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
            </button>
          </div>

          <div
            ref={frameRef}
            className="game-frame relative min-h-[56vh] flex-1 overflow-hidden border border-border bg-[#050706] md:min-h-0"
            aria-label="Leviathan ASCII Station game"
          >
            <span className="corner-mark tl" aria-hidden="true" />
            <span className="corner-mark tr" aria-hidden="true" />
            <span className="corner-mark bl" aria-hidden="true" />
            <span className="corner-mark br" aria-hidden="true" />
            <iframe
              title="Leviathan ASCII Station playable game"
              src="/game.html"
              allow="fullscreen"
            />
          </div>
        </section>

        <section className="station-help mt-5 grid gap-4 border-t border-border/70 pt-4 sm:mt-6 sm:grid-cols-[1fr_auto] sm:items-center sm:pt-5" aria-labelledby="controls-heading">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} aria-hidden="true" />
              <h2 id="controls-heading" className="font-mono text-[10px] uppercase tracking-[.2em] text-accent">Field notes</h2>
            </div>
            <p className="max-w-2xl font-mono text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
              Explore the deck. The station does not pause while you read. Use the controls below to move, inspect, and survive contact.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end" aria-label="Game controls">
            <div className="flex items-center gap-1.5">
              <span className="control-key">W</span>
              <span className="control-key">A</span>
              <span className="control-key">S</span>
              <span className="control-key">D</span>
              <span className="ml-1 font-mono text-[10px] text-muted-foreground">move</span>
            </div>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="control-key">E</span>
              <span className="font-mono text-[10px] text-muted-foreground">interact</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="control-key wide">SPACE</span>
              <span className="font-mono text-[10px] text-muted-foreground">weapon</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="control-key">↵</span>
              <span className="font-mono text-[10px] text-muted-foreground">fire</span>
            </div>
          </div>
        </section>

        <footer className="mt-4 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground/50 sm:mt-5">
          <span>Keep your light low.</span>
          <span className="flex items-center gap-1.5"><VolumeX className="h-3 w-3" aria-hidden="true" /> audio unavailable</span>
        </footer>
      </div>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
