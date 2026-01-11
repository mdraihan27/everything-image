import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Images Online Without Losing Quality",
  description:
    "Shrink image file size with smart presets or custom quality settings so photos stay sharp but load faster.",
  keywords: [
    "compress image online",
    "reduce image file size",
    "optimize photos for web",
    "online image compressor",
  ],
  openGraph: {
    title: "Online Image Compressor | Everything Image",
    description:
      "Compress images using light, medium, heavy, or custom settings while keeping visual quality high.",
    type: "website",
  },
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
