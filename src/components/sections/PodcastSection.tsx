'use client';

import { useEffect, useRef, useState } from 'react';
import { Dices, Mic, Pause, Play, Radio, Volume2 } from 'lucide-react';
import { useOS } from '@/components/motion/AppProviders';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import { PODCAST_EPISODES, ROULETTE_TOPICS } from '@/content/podcast';
import { cn } from '@/lib/utils';

function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function PodcastSection() {
  const { reducedMotion } = useOS();
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>(PODCAST_EPISODES[0]?.id ?? '');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [rouletteIndex, setRouletteIndex] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const activeEpisode =
    PODCAST_EPISODES.find((ep) => ep.id === selectedEpisodeId) ?? PODCAST_EPISODES[0];
  const activeTopic = ROULETTE_TOPICS[rouletteIndex] ?? ROULETTE_TOPICS[0];

  const stopSynth = (): void => {
    try {
      oscRef.current?.stop();
      oscRef.current?.disconnect();
    } catch {
      // Oscillator already stopped.
    }
    oscRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopSynth();
      void audioCtxRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !activeEpisode) return;

    const interval = window.setInterval(() => {
      setElapsed((prev) => {
        const next = prev + speed;
        if (next >= activeEpisode.durationSeconds) {
          setIsPlaying(false);
          stopSynth();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeEpisode, isPlaying, speed]);

  const togglePlay = (): void => {
    if (!activeEpisode) return;

    if (isPlaying) {
      setIsPlaying(false);
      stopSynth();
      return;
    }

    setIsPlaying(true);
    try {
      const AudioContextCtor = window.AudioContext;
      if (!AudioContextCtor) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextCtor();
      }
      if (audioCtxRef.current.state === 'suspended') {
        void audioCtxRef.current.resume();
      }
      stopSynth();
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.value = activeEpisode.baseFreqHz;
      gain.gain.value = 0.015;
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      oscRef.current = osc;
    } catch {
      // Keep UI scrubber functional even if browser blocks Web Audio autoplay.
    }
  };

  const selectEpisode = (id: string): void => {
    stopSynth();
    setIsPlaying(false);
    setElapsed(0);
    setSelectedEpisodeId(id);
  };

  const spinTopicRoulette = (): void => {
    setRouletteIndex((prev) => {
      if (ROULETTE_TOPICS.length <= 1) return 0;
      const offset = 1 + Math.floor(Math.random() * (ROULETTE_TOPICS.length - 1));
      return (prev + offset) % ROULETTE_TOPICS.length;
    });
  };

  return (
    <section
      id="podcast-stage"
      data-section-id="podcast-stage"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <Mic className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>07 // Podcast &amp; Stage</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Speaking on Anything With Bias to Action
          </h2>
        </div>

        <span className="rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1 font-mono text-xs text-amber-200">
          Episode Slots: TODO Placeholders
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <DraggableWindow
            title="STAGE // AUDIO DECK"
            pathLabel="~/media/podcast-player"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-400/15 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                <Radio className="h-3 w-3" aria-hidden="true" />
                SYNTH PREVIEW
              </span>
            }
          >
            {activeEpisode ? (
              <div className="rounded-xl border border-sky-400/30 bg-slate-950/75 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-amber-300">
                    {activeEpisode.episodeLabel}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                    {activeEpisode.topicTag}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-white">{activeEpisode.title}</h3>
                <p className="mt-1 text-xs text-slate-300">{activeEpisode.summary}</p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-slate-950 transition-colors hover:bg-sky-300"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Play className="h-4 w-4 translate-x-0.5" aria-hidden="true" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={activeEpisode.durationSeconds}
                      value={elapsed}
                      onChange={(e) => setElapsed(Number(e.target.value))}
                      aria-label="Audio playback progress"
                      className="h-1.5 w-full cursor-pointer accent-sky-400"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-slate-400">
                      <span>{formatSeconds(elapsed)}</span>
                      <span>{activeEpisode.durationLabel}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSpeed((prev) => (prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1))
                    }
                    aria-label="Cycle playback speed"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-200 hover:border-sky-400/40"
                  >
                    {speed}x
                  </button>
                </div>

                <div className="mt-4 flex h-7 items-end gap-1" aria-hidden="true">
                  {[35, 68, 45, 90, 52, 76, 40, 88, 60, 48, 82, 55, 70, 42, 64, 38].map(
                    (heightPct, idx) => (
                      <span
                        key={idx}
                        style={{
                          height:
                            isPlaying && !reducedMotion
                              ? `${((heightPct + ((elapsed * 17 + idx * 11) % 35)) % 90) + 10}%`
                              : `${heightPct}%`,
                        }}
                        className={cn(
                          'flex-1 rounded-sm transition-all duration-300',
                          isPlaying ? 'bg-sky-400/80' : 'bg-slate-700/70',
                        )}
                      />
                    ),
                  )}
                </div>

                <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <Volume2 className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                  Placeholder audio uses safe local Web Audio tone until real MP3/podcast links are
                  supplied.
                </p>
              </div>
            ) : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PODCAST_EPISODES.map((ep) => (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => selectEpisode(ep.id)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-colors',
                    ep.id === activeEpisode?.id
                      ? 'border-sky-400 bg-sky-400/15'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700',
                  )}
                >
                  <p className="font-mono text-[10px] text-amber-300">{ep.episodeLabel}</p>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold text-white">{ep.title}</p>
                  <p className="mt-2 font-mono text-[10px] text-slate-400">{ep.topicTag}</p>
                </button>
              ))}
            </div>
          </DraggableWindow>
        </div>

        <div className="lg:col-span-5">
          <DraggableWindow
            title="TOPIC ROULETTE"
            pathLabel="~/stage/randomizer"
            badge={
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                INTERACTIVE
              </span>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-300">
                  Spin to generate an impromptu lightning-talk prompt and 3-beat action outline.
                </p>
                <button
                  type="button"
                  onClick={spinTopicRoulette}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sky-400 px-3.5 py-2 font-mono text-xs font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:bg-sky-300"
                >
                  <Dices className="h-4 w-4" aria-hidden="true" />
                  Spin Topic
                </button>
              </div>

              {activeTopic ? (
                <div className="space-y-3 rounded-xl border border-sky-400/30 bg-slate-950/75 p-4">
                  <p className="font-mono text-[10px] tracking-wider text-sky-300 uppercase">
                    Selected Prompt #{rouletteIndex + 1}
                  </p>
                  <h3 className="text-base font-semibold text-white">{activeTopic.prompt}</h3>
                  <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                    <p className="text-slate-300">
                      <span className="font-mono text-sky-300">01 Hook:</span> {activeTopic.hook}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-mono text-sky-300">02 Action Angle:</span>{' '}
                      {activeTopic.tryActionAngle}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-mono text-emerald-300">03 Takeaway:</span>{' '}
                      {activeTopic.takeaway}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </DraggableWindow>
        </div>
      </div>
    </section>
  );
}
