import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Everything Image With a Coffee",
  description:
    "If Everything Image saves you time on quick image edits, you can support ongoing maintenance by buying a coffee.",
  keywords: [
    "support Everything Image",
    "buy me a coffee",
    "donate to image editor",
  ],
  openGraph: {
    title: "Buy a Coffee for Everything Image",
    description:
      "Enjoy using the free online image tools? Support the project with a small coffee so it can keep running.",
    url: "https://everything-image.tech/coffee",
    type: "article",
  },
};

export default function CoffeePage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black flex flex-col">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 182, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <main className="relative z-10 flex w-full flex-1 justify-center px-6 pb-20 pt-28 sm:pt-32">
        <div className="w-full max-w-3xl text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            Buy me a coffee
          </p>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Like using everything-image?
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/70 sm:text-base">
            If this little tool saves you a few minutes now and then, you can
            support its maintenance with a small coffee. No pressure at all;
            it will always stay free to use.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-2 text-sm font-semibold text-black shadow-sm transition active:scale-[0.97]"
            >
              Open coffee link
            </a>
          </div>

          <section className="mt-12 border-t border-white/10 pt-8 text-sm text-white/70">
            <h1 className="sr-only">Support this free online image editor</h1>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Help keep Everything Image fast, focused and free
            </h2>
            <p className="mt-3 max-w-3xl">
              Your coffee helps cover hosting and development time so the
              resize, convert, compress and background removal tools stay
              online for everyone who needs quick image fixes.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
