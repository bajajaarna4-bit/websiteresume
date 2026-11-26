import { Suspense } from 'react';
import { BootSequence } from '@/components/os/BootSequence';
import { CommandPalette } from '@/components/os/CommandPalette';
import { ErrorBoundary } from '@/components/os/ErrorBoundary';
import { MagneticDock } from '@/components/os/MagneticDock';
import { MenuBar } from '@/components/os/MenuBar';
import { AiLabSection } from '@/components/sections/AiLabSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FeaturedProjectSection } from '@/components/sections/FeaturedProjectSection';
import { GitHubLiveSection } from '@/components/sections/GitHubLiveSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { PodcastSection } from '@/components/sections/PodcastSection';
import { SecurityLabSection } from '@/components/sections/SecurityLabSection';
import { StartupIdeaSection } from '@/components/sections/StartupIdeaSection';
import { getGitHubOverview } from '@/lib/github';

export default async function HomePage() {
  const github = await getGitHubOverview();

  return (
    <div className="hud-grid relative min-h-dvh pb-24">
      <BootSequence />
      <MenuBar
        nowBuildingRepo={github.nowBuilding.repoName}
        nowBuildingUrl={github.nowBuilding.repoUrl}
      />
      <CommandPalette />

      <main id="main-content" className="relative z-10">
        <ErrorBoundary title="Hero Viewport">
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-6 py-32 font-mono text-xs text-slate-400">
                Booting BAJAJ.OS viewport...
              </div>
            }
          >
            <HeroSection github={github} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary title="Philosophy Module">
          <PhilosophySection />
        </ErrorBoundary>

        <ErrorBoundary title="GitHub Live Module">
          <GitHubLiveSection initialData={github} />
        </ErrorBoundary>

        <ErrorBoundary title="Featured Project Module">
          <FeaturedProjectSection />
        </ErrorBoundary>

        <ErrorBoundary title="AI Lab Module">
          <AiLabSection />
        </ErrorBoundary>

        <ErrorBoundary title="Startup Concept Module">
          <StartupIdeaSection />
        </ErrorBoundary>

        <ErrorBoundary title="Podcast & Stage Module">
          <PodcastSection />
        </ErrorBoundary>

        <ErrorBoundary title="Security Lab Module">
          <SecurityLabSection />
        </ErrorBoundary>

        <ErrorBoundary title="Contact Module">
          <ContactSection />
        </ErrorBoundary>
      </main>

      <MagneticDock />
    </div>
  );
}
