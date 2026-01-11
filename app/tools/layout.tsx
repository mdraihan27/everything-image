import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Image Tools Collection",
  description:
    "Explore Everything Image tools for resizing, converting, compressing, editing, watermarking, blurring, and removing backgrounds from photos online.",
  openGraph: {
    title: "Online Image Tools | Everything Image",
    description:
      "Browse the full set of browser-based image tools including resize, convert, compress, blur, watermark, and background removal.",
    type: "website",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
