import GetStartedButton from "./GetStartedButton";

export default function Footer() {
  return (
    <footer className="relative z-20  w-full border-t border-white/10 bg-transparent">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-start lg:justify-between">
        {/* Brand / description */}
        <div className="w-full max-w-sm text-center md:text-left flex flex-col items-center md:items-start">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/70 via-blue-500/70 to-violet-400/70 text-black">
              <span className="text-sm font-semibold">Ei</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold tracking-tight text-white">everything-image</p>
              <p className="text-xs text-white/60">Quick image edits, one simple place.</p>
            </div>
          </div>

          <div className="mt-6 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <p className="mt-6 text-sm leading-relaxed text-white/60">
            Resize, convert, compress, and clean up your images in seconds.
            No heavy software, just fast tools that run in your browser.
          </p>

          <div className="mt-6">
            <GetStartedButton label="Open playground" href="/playground" />
          </div>
        </div>

        {/* Site links */}
        <div className="w-full max-w-[180px] text-center md:text-left flex flex-col items-center md:items-start">
          <h3 className="text-sm font-medium text-white">Pages</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/60">
            <a href="/about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="/contact" className="transition-colors hover:text-white">
              Contact
            </a>
            <a href="/coffee" className="transition-colors hover:text-white">
              Buy me a coffee
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="w-full max-w-md text-center md:text-left flex flex-col items-center md:items-start">
          <h3 className="text-sm font-medium text-white">Stay in the loop</h3>
          <p className="mt-3 text-sm text-white/60">
            Be the first to know when we ship new image tools
            and quality improvements.
          </p>
          <form className="mt-4 flex h-11 w-full max-w-md items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-2 backdrop-blur-sm">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="h-full w-full bg-transparent pl-3 text-sm text-white placeholder:text-xs placeholder:text-white/50 outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-sky-300 to-sky-900 px-4 text-xs font-semibold text-black shadow-sm transition active:scale-[0.97]"
            >
              Notify me
            </button>
          </form>
          <p className="mt-2 text-xs text-white/50">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl border-t border-white/10 px-6 py-5">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} everything-image. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-white">
              Terms
            </a>
            <span className="h-3 w-px bg-white/20" />
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
