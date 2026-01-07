import GetStartedButton from "./components/GetStartedButton";
import FeaturesSection from "./components/FeaturesSection";
import WhyEverythingImageSection from "./components/WhyEverythingImageSection";
import EverythingInOnePlaceSection from "./components/EverythingInOnePlaceSection";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black flex flex-col">
      {/* Violet Storm Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(105, 182, 255, 0.25), transparent 70%), #000000",
        }}
      />

      <main className="relative z-10 flex w-full flex-1 justify-center px-6 pb-20 pt-28 sm:pt-32">
        <div className="w-full max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            Fast, free, and simple
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-b from-white via-white/80 to-white/0 bg-clip-text text-transparent">
              Your one stop solution for
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-transparent text-5xl sm:text-7xl">
              Quick Image Manipulation
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 sm:text-lg">
            A tiny corner of the internet to fix images fast, without opening a heavy editor.
          </p>

          <div className="mt-10 flex justify-center">
            <GetStartedButton label="Open Playground" href="/playground" />
          </div>

          <FeaturesSection />
          <EverythingInOnePlaceSection />
          <WhyEverythingImageSection />
        </div>
      </main>
    </div>
  );
}
