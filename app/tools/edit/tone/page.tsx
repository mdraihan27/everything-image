"use client";

import {
	useEditContext,
	SliderRow,
	ImageIcon,
	Contrast,
	SunMedium,
	Moon,
	Sparkles,
} from "../EditContext";

export default function TonePresencePage() {
	const { adjustments, updateAdjustment } = useEditContext();

	return (
		<section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 sm:p-4">
			<div className="flex items-center gap-2 mb-3">
				<ImageIcon size={16} className="text-white/70" />
				<h2 className="text-xs sm:text-sm font-medium text-white/90 tracking-wide uppercase">
					Tone &amp; Presence
				</h2>
			</div>

			<div className="space-y-3">
				<div className="space-y-3">
					<SliderRow
						label="Highlights"
						icon={<SunMedium size={14} className="text-white/60" />}
						min={-100}
						max={100}
						value={adjustments.highlights}
						onChange={(v) => updateAdjustment("highlights", v)}
						unit="%"
					/>
					<SliderRow
						label="Shadows"
						icon={<Moon size={14} className="text-white/60" />}
						min={-100}
						max={100}
						value={adjustments.shadows}
						onChange={(v) => updateAdjustment("shadows", v)}
						unit="%"
					/>
					<SliderRow
						label="Clarity"
						icon={<Sparkles size={14} className="text-white/60" />}
						min={-100}
						max={100}
						value={adjustments.clarity}
						onChange={(v) => updateAdjustment("clarity", v)}
						unit="%"
					/>
				</div>
			</div>
		</section>
	);
}
