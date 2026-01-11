import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Text to Image Online | Everything Image",
  description:
    "Add text to images online with multiple layers, custom fonts, colors, opacity, rotation, and shadows using Everything Image's free text editor.",
  keywords: [
    "add text to image",
    "text on photo",
    "online image editor",
    "photo text editor",
    "add caption to image",
    "add watermark text",
    "editable text overlay",
    "draggable text layer",
    "custom font image text",
    "image text tool",
    "Everything Image tools",
  ],
  openGraph: {
    title: "Add Text to Image Online | Everything Image",
    description:
      "Add multiple draggable text layers with custom fonts, colors, opacity, rotation, and shadow directly on your images.",
    type: "website",
  },
};

export default function AddTextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
