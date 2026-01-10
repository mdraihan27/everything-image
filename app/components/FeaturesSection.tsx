"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BadgeCheck,
  Crop,
  FileImage,
  Sparkles,
  Type,
  Wand2,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

type Feature = {
  title: string;
  description: string;
  badges: string[];
  icon: LucideIcon;
  href?: string;
  popular?: boolean;
};

export default function FeaturesSection() {
  const features = useMemo<Feature[]>(
    () => [
      {
        title: "Pro Photo editor",
        description: "Jump into the multi-tool editor for basic color and tone tweaks.",
        badges: ["Basic", "Color", "Tone"],
        icon: Crop,
        href: "/tools/edit",
        popular: true,
      },
      {
        title: "Remove BG",
        description: "Cut out subjects cleanly in one click, ready for new backgrounds.",
        badges: ["PNG", "Edges", "Fast"],
        icon: Wand2,
        href: "/tools/remove-bg",
        popular: true,
      },
       {
        title: "Convert formats",
        description: "Switch between 25+ formats including PNG, JPEG, WebP, AVIF, and more.",
        badges: ["PNG", "JPEG", "WebP"],
        icon: FileImage,
        href: "/tools/convert",
        popular: true,
      },
      {
        title: "Crop, Rotate & Resize",
        description: "Transform images with precise cropping, rotation, and resizing tools.",
        badges: ["Crop", "Rotate", "Resize"],
        icon: Crop,
        href: "/tools/crop-rotate-resize",
      },
     
      {
        title: "Compress image",
        description: "Shrink file size while keeping the image crisp.",
        badges: ["Quality", "Smaller", "Quick"],
        icon: Archive,
        href: "/tools/compress",
      },
      {
        title: "Blur & mosaic",
        description: "Hide faces, text, or sensitive areas with blur or mosaic.",
        badges: ["Blur", "Mosaic", "Selective"],
        icon: Sparkles,
        href: "/tools/blur-mosaic",
      },
      {
        title: "Add watermark",
        description: "Protect your work with subtle text or logo overlays.",
        badges: ["Text", "Logo", "Opacity"],
        icon: BadgeCheck,
        href: "/tools/watermark",
      },
      {
        title: "Add text",
        description: "Place beautiful, fully controllable text anywhere on your image.",
        badges: ["Fonts", "Colors", "Layers"],
        icon: Type,
        href: "/tools/add-text",
      },
      {
        title: "Enhance quality",
        description: "Upscale, sharpen, and lightly boost contrast and clarity.",
        badges: ["Sharper", "Cleaner", "Upscale"],
        icon: Sparkles,
        href: "/tools/enhance",
      },
      
    ],
    []
  );

  return (
    <section className="mt-6  w-full">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            Quick things you can do
          </p> */}
          
          <p className="max-w-2xl text-sm leading-6 text-white/70 sm:text-base mb-8">
            Drop in a file, make a few changes, grab the download, and move on with your day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              badges={feature.badges}
              icon={feature.icon}
              href={feature.href}
              popular={feature.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
