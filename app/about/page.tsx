import GetStartedButton from "../components/GetStartedButton";
import { CheckCircle2, Clock, Layers, MonitorSmartphone } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 182, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <main className="relative z-10 flex w-full flex-1 justify-center px-6 pb-20 pt-28 sm:pt-32">
        <div className="w-full max-w-5xl text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            About everything-image
          </p>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for the boring image jobs everyone has to do
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
            Some days you need a full design tool. Most days, you just need to
            quickly fix a file: make it smaller, change the format, crop the
            edge off, or rotate the sideways photo your friend sent you. That is
            what everything-image is for.
          </p>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
            Instead of opening a heavy app or juggling a bunch of random
            websites with popups and ads, you get one calm page where the
            obvious controls are always in reach. Open tab, drop image, tweak,
            download, close tab. Done.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <GetStartedButton label="Open playground" />
            <p className="text-xs text-white/60">
              No accounts, no paywall. Just a quick place to get it over with.
            </p>
          </div>

          {/* Why this needed to exist */}
          <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Why bother building another image tool?
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70 sm:text-base">
                Most image tools sit at one of two extremes:
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-1 text-white/40">
                    <Clock className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="font-medium text-white/90">Big desktop apps</span>
                    <span>
                      {" "}
                      take time to open, feel overwhelming when you only need to
                      resize a single banner, and live on machines you might not
                      always be near.
                    </span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 text-white/40">
                    <MonitorSmartphone className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="font-medium text-white/90">Random online sites</span>
                    <span>
                      {" "}
                      often bury the actual download behind confusing buttons,
                      ads, fake progress bars, or a surprise signup.
                    </span>
                  </span>
                </li>
              </ul>

              <p className="mt-4 text-sm leading-6 text-white/70 sm:text-base">
                everything-image tries to live in the quiet middle: fast to
                open, light on decisions, and honest about what is happening to
                your file.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur-sm">
              <p className="font-semibold text-white">Design goal</p>
              <p className="mt-2">
                If it takes longer to understand the interface than to fix the
                image, we failed.
              </p>
              <p className="mt-3 text-xs text-white/60">
                everything-image is for thumbnails, quick exports for decks,
                screenshots, last-minute blog images, and client assets that
                "just need to be a bit smaller".
              </p>
            </div>
          </section>

          {/* Comparison cards: others vs everything-image */}
          <section className="mt-16">
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              What other tools usually feel like vs. what this tries to be
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Typical online image tool
                </p>
                <ul className="mt-4 space-y-2 text-xs sm:text-sm">
                  <li className="flex gap-2">
                    <span className="mt-[2px] text-white/40">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <span>Multiple steps before you even see the real download button.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px] text-white/40">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      Surprise popups asking for an account, newsletter, or extra upsell.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px] text-white/40">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <span>Too many toggles and modes for tiny tasks.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px] text-white/40">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <span>Not always clear what quality or format you are actually getting.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-sky-400/60 bg-sky-400/10 p-5 text-sm text-white/80 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-200">
                  everything-image
                </p>
                <ul className="mt-4 space-y-2 text-xs sm:text-sm">
                  <li className="flex gap-2">
                    <span className="mt-[2px] text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>One screen with the basics: size, format, background, and quality.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px] text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>No accounts, no email wall, no quiz before you can export.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px] text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>Clear labels so you always know what will happen to the file.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px] text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>Optimized for speed: open, tweak, download in under a minute.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
