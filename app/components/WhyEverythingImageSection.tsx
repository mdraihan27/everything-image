"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Bolt, CheckCircle2, Lock, Rocket, Sparkles } from "lucide-react";

type ReasonCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  points: string[];
};

export default function WhyEverythingImageSection() {
  const reasons = useMemo<ReasonCard[]>(
    () => [
      {
        title: "Built for speed",
        description: "No clutter, no signup wall  just drop an image and go.",
        icon: Rocket,
        points: [
          "Opens fast, even on a sleepy laptop",
          "One-click actions for the stuff you do all the time",
          "No learning curve, no setup",
        ],
      },
      {
        title: "Laid back, not overwhelming",
        description:
          "Everything you need for day-to-day fixes, nothing that gets in the way.",
        icon: Sparkles,
        points: [
          "Clean, friendly interface",
          "No design skills or jargon required",
          "Defaults that feel right out of the box",
        ],
      },
      {
        title: "Respectful of your files",
        description:
          "Your images stay yours - edit, download, and get back to real work.",
        icon: Lock,
        points: [
          "No weird popups or dark patterns",
          "Clear, predictable exports every time",
          "You choose the balance between speed and quality",
        ],
      },
    ],
    []
  );

  return (
    <section className="mt-20 w-full">
      <div className="mx-auto w-full max-w-6xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500/20 text-sky-200">
            <Bolt className="h-3 w-3" />
          </span>
          Why everything-image?
        </p>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          For people who just want to fix the image and move on
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
          Thumbnails, quick exports for slides, cleaning up a client file, or
          resizing something for a post - everything-image keeps it light so you
          can be done in a minute or two.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-white/10"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                    <reason.icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight text-white">
                    {reason.title}
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-6 text-white/70">
                  {reason.description}
                </p>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-white/70">
                {reason.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-[2px] text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
