import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Watermark to Images Online",
  description:
    "Protect your photos by adding text or logo watermarks online with flexible fonts, positions and opacity.",
  keywords: [
    "add watermark to image",
    "online watermark tool",
    "add logo to photo",
    "protect images online",
  ],
  openGraph: {
    title: "Online Watermark Tool | Everything Image",
    description:
      "Add subtle text or logo watermarks to images to protect your work before sharing.",
    type: "website",
  },
};

export default function WatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
