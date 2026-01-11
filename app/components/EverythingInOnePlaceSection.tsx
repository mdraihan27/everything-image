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
            Instead of jumping between different sites to resize, convert,
            compress, remove backgrounds, blur details, add text, or add a
            watermark, Everything Image keeps the everyday fixes in one simple
            place.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                <Images className="h-4 w-4" />
              </span>
              Edit essentials together
            </div>
            <p className="mt-3 text-xs leading-6 text-white/70">
              Resize, crop, rotate, tweak tone and clean up an image in one
              place so you do not have to open a heavy editor for quick fixes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                <FolderTree className="h-4 w-4" />
              </span>
              Clear export options
            </div>
            <p className="mt-3 text-xs leading-6 text-white/70">
              Pick PNG, JPG, WebP, AVIF and more, set quality and size, and see
              exactly what you are downloading before you hit save.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-sky-400/60 hover:bg-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                <Workflow className="h-4 w-4" />
              </span>
              Built for real workflows
            </div>
            <p className="mt-3 text-xs leading-6 text-white/70">
              Made for real tasks: thumbnails, profile pictures, decks, client
              fixes, quick web exports and everything you do over and over.
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
              Start with one image and quickly make versions sized for email,
              social posts, slides, and client handoff so you are not repeating
              the same edits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
