import type { Metadata } from "next";
import type { ReactNode } from "react";
import EditClientLayout from "./EditClientLayout";

export const metadata: Metadata = {
	title: "Advanced Photo Editor Online",
	description:
		"Fine-tune brightness, contrast, tone, HSL color grading, vignette, grain, noise and sharpness with the Everything Image pro editor.",
	openGraph: {
		title: "Advanced Online Photo Editor | Everything Image",
		description:
			"Use layered controls for exposure, tone, color and effects to tweak photos non-destructively in your browser.",
		type: "website",
	},
};

export default function EditLayout({ children }: { children: ReactNode }) {
	return <EditClientLayout>{children}</EditClientLayout>;
}

