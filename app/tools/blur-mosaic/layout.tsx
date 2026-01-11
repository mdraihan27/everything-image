import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blur or Pixelate Image Areas Online",
  description:
    "Use the blur and mosaic tool to hide faces, text, and sensitive details in photos and screenshots directly in your browser.",
  keywords: [
    "blur image online",
    "pixelate photo",
    "mosaic sensitive data",
    "hide faces in screenshot",
  ],
  openGraph: {
    title: "Blur & Mosaic Tool | Hide Sensitive Details",
    description:
      "Paint blur or pixelated mosaic over parts of an image to protect privacy before sharing.",
    type: "website",
  },
};

export default function BlurMosaicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
