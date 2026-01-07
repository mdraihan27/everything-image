import { Box, FolderTree, Images, Workflow } from "lucide-react";

export default function EverythingInOnePlaceSection() {
  return (
    <section className="mt-20 w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 text-left sm:flex-row sm:items-start">
        <div className="sm:w-[45%]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500/20 text-sky-200">
              <Box className="h-3 w-3" />
            </span>
            Everything in one place
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            One tab for the boring image stuff
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
            Instead of juggling a bunch of random tools, everything-image keeps
            the basics together: size, format, background, and quality in one
            simple place.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                <Images className="h-4 w-4" />
              </span>
              Core edits together
            </div>
            <p className="mt-3 text-xs leading-6 text-white/70">
              Resize, crop, rotate, compress, and tweak exports without opening
              a second tab.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                <FolderTree className="h-4 w-4" />
              </span>
              Clear export flow
            </div>
            <p className="mt-3 text-xs leading-6 text-white/70">
              See format, size, and quality options in one place so you always
              know what you are downloading.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                <Workflow className="h-4 w-4" />
              </span>
              Works like your brain
            </div>
            <p className="mt-3 text-xs leading-6 text-white/70">
              Made for real-world tasks: thumbnails, decks, client fixes,
              quick web exports and more.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                <Box className="h-4 w-4" />
              </span>
              Ready-to-go variants
            </div>
            <p className="mt-3 text-xs leading-6 text-white/70">
              Start with one image and leave with all the versions you need -
              sized for email, social posts, slides, and client handoff.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
