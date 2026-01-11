"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  EditProvider,
  useEditContext,
  Upload,
  Download,
  Undo2,
  Redo2,
  SplitSquareHorizontal,
  RotateCw,
} from "./EditContext";

const FEATURE_TABS = [
  {
    slug: "basic",
    label: "Basic",
    description: "Exposure & color",
  },
  {
    slug: "tone",
    label: "Tone",
    description: "Curves & presence",
  },
  {
    slug: "effects",
    label: "Effects",
    description: "Vignette, grain, noise",
  },
  {
    slug: "color",
    label: "Color",
    description: "HSL color grading",
  },
];

function EditShell({ children }: { children: ReactNode }) {
  const {
    hasImage,
    fileInputRef,
    handleFileUpload,
    handleDownload,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    showOriginal,
    setShowOriginal,
    handleResetAdjustments,
    canvasRef,
  } = useEditContext();

  const pathname = usePathname();
  const activeSlug = FEATURE_TABS.find((tab) => pathname?.endsWith(`/edit/${tab.slug}`))?.slug;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black flex flex-col">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.18), transparent 70%), #000000",
        }}
      />

      <main className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-20 pt-28 sm:pt-32">
        <div className="w-full max-w-7xl mb-6 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-center mb-2 sm:mb-3">
            <span className="bg-linear-to-r from-white via-sky-200 to-violet-200 bg-clip-text text-transparent">
              Pro Photo Editor
            </span>
          </h1>
          <p className="text-center text-white/60 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 px-4">
            Fine-tune exposure, tone, color grading, and texture with precise, layered controls.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
            >
              <Upload size={16} className="sm:w-4.5 sm:h-4.5" />
              <span className="hidden xs:inline">Upload Image</span>
              <span className="xs:hidden">Upload</span>
            </button>

            {hasImage && (
              <>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-green-200 backdrop-blur-md transition-all hover:bg-green-500/20 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                >
                  <Download size={16} className="sm:w-4.5 sm:h-4.5" />
                  Download
                </button>

                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-white/80 backdrop-blur-md">
                  <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1 transition-all cursor-pointer ${
                      canUndo
                        ? "hover:bg-white/10 text-white/80"
                        : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <Undo2 size={14} />
                    <span className="hidden sm:inline">Undo</span>
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1 transition-all cursor-pointer ${
                      canRedo
                        ? "hover:bg-white/10 text-white/80"
                        : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <Redo2 size={14} />
                    <span className="hidden sm:inline">Redo</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowOriginal((prev) => !prev)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs sm:text-sm backdrop-blur-md cursor-pointer transition-all ${
                    showOriginal
                      ? "border-sky-400/60 bg-sky-400/20 text-sky-100"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <SplitSquareHorizontal size={16} />
                  {showOriginal ? "Showing Before" : "Show Before"}
                </button>

                <button
                  onClick={handleResetAdjustments}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs sm:text-sm text-white/80 backdrop-blur-md hover:bg-white/10 cursor-pointer"
                >
                  <RotateCw size={16} />
                  Reset
                </button>
              </>
            )}
          </div>
        </div>

        {hasImage ? (
          <div className="w-full max-w-7xl px-2">
            <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 sm:gap-6">
              <div className="space-y-4 max-h-[640px] xl:max-h-[720px] overflow-y-auto pr-1 sm:pr-2">
                <nav className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-2.5 sm:p-3 flex flex-col gap-1.5 text-xs sm:text-sm">
                  <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-white/60">
                    Tools
                  </span>
                  <div className="flex flex-col gap-1">
                    {FEATURE_TABS.map((tab) => {
                      const isActive = activeSlug === tab.slug;
                      return (
                        <Link
                          key={tab.slug}
                          href={`/tools/edit/${tab.slug}`}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                            isActive
                              ? "bg-sky-500/20 text-sky-100 border border-sky-500/40 shadow-[0_0_18px_rgba(56,189,248,0.45)]"
                              : "text-white/70 border border-transparent hover:border-white/15 hover:bg-white/5"
                          }`}
                        >
                          <span className="font-medium text-[11px] sm:text-xs">
                            {tab.label}
                          </span>
                          <span className="ml-2 text-[10px] text-white/40 hidden sm:inline">
                            {tab.description}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                {children}
              </div>

              <div className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex items-center justify-center">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px",
                  }}
                />
                <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-full block rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.6)] bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl px-2">
            <div className="relative w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden min-h-[420px] sm:min-h-[500px] flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-center px-6">
                <div className="rounded-full border-2 border-dashed border-white/20 p-10 mb-4">
                  <Upload size={40} className="text-white/40" />
                </div>
                <p className="text-white/60 text-sm sm:text-base mb-2">
                  Upload an image to start editing
                </p>
                <p className="text-white/40 text-xs sm:text-sm mb-4 max-w-md">
                  Adjust exposure, tone, color, and texture with precise controls. All edits are non-destructive and fully undoable.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs sm:text-sm text-white/90 backdrop-blur-md hover:bg-white/20 cursor-pointer"
                >
                  <Upload size={16} />
                  Choose Image
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function EditClientLayout({ children }: { children: ReactNode }) {
  return (
    <EditProvider>
      <EditShell>{children}</EditShell>
    </EditProvider>
  );
}
