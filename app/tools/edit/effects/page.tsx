"use client";

import {
	useEditContext,
	SliderRow,
	CircleDot,
	Sparkles,
	Aperture,
} from "../EditContext";

export default function EffectsTexturePage() {
	const { adjustments, updateAdjustment } = useEditContext();

	return (
		<section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 sm:p-4">
			<div className="flex items-center gap-2 mb-3">
				<CircleDot size={16} className="text-white/70" />
				<h2 className="text-xs sm:text-sm font-medium text-white/90 tracking-wide uppercase">
					Effects &amp; Texture
				</h2>
			</div>

			<div className="space-y-3">
				<SliderRow
					label="Vignette"
					icon={<CircleDot size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.vignette}
					onChange={(v) => updateAdjustment("vignette", v)}
					unit="%"
				/>
				<SliderRow
					label="Vignette Feather"
					icon={<CircleDot size={14} className="text-white/60" />}
					min={10}
					max={100}
					value={adjustments.vignetteFeather}
					onChange={(v) => updateAdjustment("vignetteFeather", v)}
					unit="%"
				/>
				<SliderRow
					label="Grain"
					icon={<Sparkles size={14} className="text-white/60" />}
					min={0}
					max={100}
					value={adjustments.grain}
					onChange={(v) => updateAdjustment("grain", v)}
					unit="%"
				/>
				<SliderRow
					label="Noise"
					icon={<Sparkles size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.noise}
					onChange={(v) => updateAdjustment("noise", v)}
					unit="%"
				/>
				<SliderRow
					label="Sharpness"
					icon={<Aperture size={14} className="text-white/60" />}
					min={-100}
					max={100}
					value={adjustments.sharpness}
					onChange={(v) => updateAdjustment("sharpness", v)}
					unit="%"
				/>
			</div>
		</section>
	);
}
