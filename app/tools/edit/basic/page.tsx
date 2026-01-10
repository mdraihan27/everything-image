"use client";

import {
	useEditContext,
	SliderRow,
	SlidersHorizontal,
	SunMedium,
	Contrast,
	Aperture,
	Sparkles,
} from "../EditContext";

export default function BasicAdjustmentsPage() {
	const { adjustments, updateAdjustment } = useEditContext();

	return (
		<section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 sm:p-4">
			<div className="flex items-center gap-2 mb-3">
				<SlidersHorizontal size={16} className="text-white/70" />
				<h2 className="text-xs sm:text-sm font-medium text-white/90 tracking-wide uppercase">
					Basic Adjustments
				</h2>
			</div>

			<div className="space-y-3">
				<SliderRow
					label="Temperature"
					icon={<SunMedium size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.temperature}
					onChange={(v) => updateAdjustment("temperature", v)}
					unit="%"
				/>

				<SliderRow
					label="Tint"
					icon={<Sparkles size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.tint}
					onChange={(v) => updateAdjustment("tint", v)}
					unit="%"
				/>

				<SliderRow
					label="Brightness"
					icon={<SunMedium size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.brightness}
					onChange={(v) => updateAdjustment("brightness", v)}
					unit="%"
				/>

				<SliderRow
					label="Contrast"
					icon={<Contrast size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.contrast}
					onChange={(v) => updateAdjustment("contrast", v)}
					unit="%"
				/>

				<SliderRow
					label="Saturation"
					icon={<Aperture size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.saturation}
					onChange={(v) => updateAdjustment("saturation", v)}
					unit="%"
				/>

				<SliderRow
					label="Vibrance"
					icon={<Sparkles size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.vibrance}
					onChange={(v) => updateAdjustment("vibrance", v)}
					unit="%"
				/>
			</div>
		</section>
	);
}
