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
            support its maintenance with a small coffee. No pressure at all &mdash;
            it will always stay free to use.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-2 text-sm font-semibold text-black shadow-sm transition active:scale-[0.97]"
            >
              Open coffee link
            </a>
            <p className="text-xs text-white/60">
              Replace this link with your BuyMeACoffee, Ko-fi, or tip jar URL.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
