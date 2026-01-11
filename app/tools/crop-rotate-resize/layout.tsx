import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop, Rotate and Resize Images Online",
  description:
    "Fix composition, rotate, and change the dimensions of your images with an online crop, rotate and resize tool.",
  keywords: [
    "crop image online",
    "rotate photo",
    "resize image dimensions",
    "change image size in browser",
  ],
  openGraph: {
    title: "Crop, Rotate & Resize Tool | Everything Image",
    description:
      "Crop to common aspect ratios, rotate and resize images to exact pixel sizes for social media, profiles and banners.",
    type: "website",
  },
};

export default function CropRotateResizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
