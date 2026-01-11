import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert Images Between PNG, JPG, WebP and More",
  description:
    "Convert images between over 25 formats including PNG, JPEG, WebP, AVIF, GIF and more with a simple online converter.",
  keywords: [
    "convert image online",
    "png to jpg converter",
    "jpg to webp",
    "image format converter",
  ],
  openGraph: {
    title: "Online Image Converter | Everything Image",
    description:
      "Quickly convert images between PNG, JPG, WebP, AVIF and many other formats in your browser.",
    type: "website",
  },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
