import type { Metadata } from "next";
import PlaygroundClient from "./PlaygroundClient";

export const metadata: Metadata = {
  title: "Online Image Playground Editor",
  description:
    "Use the Everything Image playground to experiment with cropping, zooming, panning and basic edits on your photos directly in the browser.",
  keywords: [
    "image playground",
    "online image editor",
    "crop image in browser",
    "zoom and pan photo",
  ],
  openGraph: {
    title: "Image Playground | Try Online Image Editing",
    description:
      "Drag, crop, zoom and explore basic edits in the Everything Image playground before using the dedicated tools.",
    url: "https://everything-image.tech/playground",
    type: "website",
  },
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}

