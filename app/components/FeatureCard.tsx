import type { LucideIcon } from "lucide-react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

type FeatureCardProps = {
  title: string;
  description: string;
  badges?: string[];
  className?: string;
  icon?: LucideIcon;
  href?: string;
  popular?: boolean;
};

export default function FeatureCard({
  title,
  description: _description,
  badges: _badges,
  className,
  icon: Icon,
  href,
  popular,
}: FeatureCardProps) {
  const content = (
    <div
      className={
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left " +
        "backdrop-blur-sm transition hover:bg-white/10 " +
        (href ? "cursor-pointer " : "") +
        (className ? className : "")
      }
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400/20 via-blue-500/10 to-violet-400/20 blur-2xl" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon ? (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-sky-300 ring-1 ring-white/10">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
            ) : null}

            <h3 className="text-base font-semibold tracking-tight text-white">
              {title}
            </h3>
          </div>

          {popular ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black shadow-[0_0_18px_rgba(251,191,36,0.8)] animate-pulse ">
              <Sparkles className="h-3 w-3" strokeWidth={2} />
              <span>Popular</span>
            </span>
          ) : null}
        </div>

        {href ? (
          <div className="mt-4 inline-flex items-center text-xs font-medium text-sky-300/80 group-hover:text-sky-200">
            <span>Open</span>
            <ArrowRight className="ml-1 h-3 w-3" strokeWidth={1.75} />
          </div>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
