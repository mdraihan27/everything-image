"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BadgeCheck,
  Crop,
  FileImage,
  Maximize2,
  Monitor,
  RotateCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

type Feature = {
  title: string;
  description: string;
  badges: string[];
  icon: LucideIcon;
  href?: string;
};

export default function FeaturesSection() {
  const features = useMemo<Feature[]>(
    () => [
      {
        title: "Remove background",
        description: "Cut out subjects cleanly in one click, ready for new backgrounds.",
        badges: ["PNG", "Edges", "Fast"],
        icon: Wand2,
        href: "/tools/remove-bg",
      },
      {
        title: "Crop, Rotate & Resize",
        description: "Transform images with precise cropping, rotation, and resizing tools.",
        badges: ["Crop", "Rotate", "Resize"],
        icon: Crop,
        href: "/tools/crop-rotate-resize",
      },
      {
        title: "Convert format",
        description: "Switch between 28+ formats including PNG, JPEG, WebP, AVIF, and more.",
        badges: ["PNG", "JPEG", "WebP"],
        icon: FileImage,
        href: "/tools/convert",
      },
      {
        title: "Compress",
        description: "Shrink file size while keeping the image crisp.",
        badges: ["Quality", "Smaller", "Quick"],
        icon: Archive,
      },
      {
        title: "Convert format",
        description: "Switch between JPG, PNG, and WebP in seconds.",
        badges: ["JPG", "PNG", "WebP"],
        icon: FileImage,
      },
      {
        title: "Crop & frame",
        description: "Crop to exact aspect ratios or custom frames.",
        badges: ["1:1", "16:9", "Custom"],
        icon: Crop,
      },
      {
        title: "Rotate & flip",
        description: "Fix orientation instantly—rotate, mirror, or flip.",
        badges: ["Rotate", "Flip", "Mirror"],
        icon: RotateCw,
      },
      {
        title: "Add watermark",
        description: "Protect your work with subtle text or logo overlays.",
        badges: ["Text", "Logo", "Opacity"],
        icon: BadgeCheck,
      },
      {
        title: "Enhance",
        description: "Light tweaks for brightness, contrast, and clarity.",
        badges: ["Brightness", "Contrast", "Clarity"],
        icon: Sparkles,
      },
    ],
    []
  );

  return (
    <section className="mt-16 w-full">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            Quick things you can do
          </p>
          
          <p className="max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
            Drop in a file, make a few changes, grab the download, and move on with your day.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              badges={feature.badges}
              icon={feature.icon}
              href={feature.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
