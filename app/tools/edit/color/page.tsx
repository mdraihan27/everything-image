"use client";

import {
	useEditContext,
	MiniSlider,
	COLOR_BAND_CONFIG,
	SlidersHorizontal,
} from "../EditContext";

export default function ColorGradingPage() {
	const { adjustments, updateColorBand } = useEditContext();

	return (
		<section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 sm:p-4">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<SlidersHorizontal size={16} className="text-white/70" />
					<h2 className="text-xs sm:text-sm font-medium text-white/90 tracking-wide uppercase">
						Color Grading (HSL)
					</h2>
				</div>
				<span className="text-[10px] text-white/50">Hue &amp; saturation by rainbow colors</span>
			</div>

			<div className="space-y-2.5">
				{COLOR_BAND_CONFIG.map((band) => {
					const bandState = adjustments.colorBands[band.key];
					return (
						<div
							key={band.key}
							className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 flex flex-col gap-2"
						>
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<span
										className="h-3 w-3 rounded-full"
										style={{ backgroundColor: band.color }}
									/>
									<span className="text-xs text-white/80">{band.label}</span>
								</div>
								<span className="text-[10px] text-white/50">
									H: {bandState.hue.toFixed(0)}° · S: {bandState.saturation.toFixed(0)}%
								</span>
							</div>
							<div className="space-y-1.5">
								<MiniSlider
									label="Hue"
									min={-60}
									max={60}
									value={bandState.hue}
									onChange={(v) => updateColorBand(band.key, { hue: v })}
								/>
								<MiniSlider
									label="Saturation"
									min={-100}
									max={100}
									value={bandState.saturation}
									onChange={(v) => updateColorBand(band.key, { saturation: v })}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
