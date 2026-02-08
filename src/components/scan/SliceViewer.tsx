import { useRef, useEffect, useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Overlays {
	wt: boolean;
	tc: boolean;
	et: boolean;
	opacity: number;
}

interface SliceViewerProps {
	overlays: Overlays;
}

const TOTAL_SLICES = 155;
const CANVAS_SIZE = 480;

function drawSlice(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	slice: number,
	total: number,
	overlays: Overlays,
) {
	const progress = slice / total;
	const cx = w / 2;
	const cy = h / 2;

	// Background
	ctx.fillStyle = "#0a0a0a";
	ctx.fillRect(0, 0, w, h);

	// Only draw brain if slice is within range
	const brainPresence = Math.sin(progress * Math.PI);
	if (brainPresence < 0.08) return;

	const skullRx = w * 0.38 * brainPresence;
	const skullRy = h * 0.42 * brainPresence;

	// Add subtle grain noise
	const imageData = ctx.getImageData(0, 0, w, h);
	const data = imageData.data;
	for (let i = 0; i < data.length; i += 4) {
		const noise = Math.random() * 6;
		data[i] += noise;
		data[i + 1] += noise;
		data[i + 2] += noise;
	}
	ctx.putImageData(imageData, 0, 0);

	// Skull (bright ring)
	const skullGrad = ctx.createRadialGradient(
		cx,
		cy,
		skullRx * 0.85,
		cx,
		cy,
		skullRx,
	);
	skullGrad.addColorStop(0, "rgba(220,220,220,0)");
	skullGrad.addColorStop(0.6, "rgba(190,190,190,0.4)");
	skullGrad.addColorStop(0.85, "rgba(210,210,210,0.9)");
	skullGrad.addColorStop(1, "rgba(140,140,140,0.3)");

	ctx.beginPath();
	ctx.ellipse(cx, cy, skullRx, skullRy, 0, 0, Math.PI * 2);
	ctx.fillStyle = skullGrad;
	ctx.fill();

	// Brain matter (cortex)
	const cortexGrad = ctx.createRadialGradient(
		cx,
		cy * 0.98,
		0,
		cx,
		cy,
		skullRx * 0.88,
	);
	cortexGrad.addColorStop(0, "rgba(160,160,160,1)");
	cortexGrad.addColorStop(0.5, "rgba(130,130,130,1)");
	cortexGrad.addColorStop(0.8, "rgba(100,100,100,1)");
	cortexGrad.addColorStop(1, "rgba(80,80,80,0.8)");

	ctx.beginPath();
	ctx.ellipse(cx, cy, skullRx * 0.88, skullRy * 0.88, 0, 0, Math.PI * 2);
	ctx.fillStyle = cortexGrad;
	ctx.fill();

	// White matter regions
	ctx.fillStyle = "rgba(145,145,145,0.7)";
	ctx.beginPath();
	ctx.ellipse(
		cx - skullRx * 0.2,
		cy * 0.95,
		skullRx * 0.35,
		skullRy * 0.3,
		-0.15,
		0,
		Math.PI * 2,
	);
	ctx.fill();
	ctx.beginPath();
	ctx.ellipse(
		cx + skullRx * 0.2,
		cy * 0.95,
		skullRx * 0.35,
		skullRy * 0.3,
		0.15,
		0,
		Math.PI * 2,
	);
	ctx.fill();

	// Midline fissure
	ctx.strokeStyle = "rgba(50,50,50,0.5)";
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(cx, cy - skullRy * 0.85);
	ctx.lineTo(cx, cy - skullRy * 0.1);
	ctx.stroke();

	// Ventricles (visible in middle slices)
	if (progress > 0.25 && progress < 0.75) {
		const ventIntensity = Math.sin(((progress - 0.25) / 0.5) * Math.PI);
		ctx.fillStyle = `rgba(30,30,30,${ventIntensity * 0.9})`;

		// Left ventricle
		ctx.beginPath();
		ctx.ellipse(
			cx - skullRx * 0.12,
			cy * 0.95,
			skullRx * 0.06 * ventIntensity,
			skullRy * 0.18 * ventIntensity,
			-0.25,
			0,
			Math.PI * 2,
		);
		ctx.fill();

		// Right ventricle
		ctx.beginPath();
		ctx.ellipse(
			cx + skullRx * 0.12,
			cy * 0.95,
			skullRx * 0.06 * ventIntensity,
			skullRy * 0.18 * ventIntensity,
			0.25,
			0,
			Math.PI * 2,
		);
		ctx.fill();

		// Third ventricle
		ctx.beginPath();
		ctx.ellipse(
			cx,
			cy * 1.05,
			skullRx * 0.02,
			skullRy * 0.05 * ventIntensity,
			0,
			0,
			Math.PI * 2,
		);
		ctx.fill();
	}

	// Tumour (appears in specific slices)
	if (progress > 0.3 && progress < 0.7) {
		const tumorIntensity = Math.sin(((progress - 0.3) / 0.4) * Math.PI);
		const tumorX = cx + skullRx * 0.28;
		const tumorY = cy - skullRy * 0.12;
		const tumorR = skullRx * 0.16 * tumorIntensity;

		// Base tumor appearance (hyperintense region)
		const tumorGrad = ctx.createRadialGradient(
			tumorX,
			tumorY,
			0,
			tumorX,
			tumorY,
			tumorR * 1.2,
		);
		tumorGrad.addColorStop(0, `rgba(200,200,200,${tumorIntensity * 0.8})`);
		tumorGrad.addColorStop(0.5, `rgba(170,170,170,${tumorIntensity * 0.6})`);
		tumorGrad.addColorStop(1, `rgba(130,130,130,${tumorIntensity * 0.2})`);

		ctx.beginPath();
		ctx.ellipse(
			tumorX,
			tumorY,
			tumorR * 1.2,
			tumorR * 1.0,
			0.3,
			0,
			Math.PI * 2,
		);
		ctx.fillStyle = tumorGrad;
		ctx.fill();

		// Segmentation overlays
		if (overlays.wt) {
			ctx.fillStyle = `rgba(255, 230, 0, ${overlays.opacity * 0.35 * tumorIntensity})`;
			ctx.beginPath();
			ctx.ellipse(
				tumorX,
				tumorY,
				tumorR * 1.3,
				tumorR * 1.1,
				0.3,
				0,
				Math.PI * 2,
			);
			ctx.fill();
			ctx.strokeStyle = `rgba(255, 230, 0, ${overlays.opacity * 0.6 * tumorIntensity})`;
			ctx.lineWidth = 1.5;
			ctx.stroke();
		}

		if (overlays.tc) {
			ctx.fillStyle = `rgba(255, 50, 50, ${overlays.opacity * 0.4 * tumorIntensity})`;
			ctx.beginPath();
			ctx.ellipse(
				tumorX,
				tumorY,
				tumorR * 0.8,
				tumorR * 0.7,
				0.2,
				0,
				Math.PI * 2,
			);
			ctx.fill();
			ctx.strokeStyle = `rgba(255, 50, 50, ${overlays.opacity * 0.7 * tumorIntensity})`;
			ctx.lineWidth = 1.5;
			ctx.stroke();
		}

		if (overlays.et) {
			ctx.fillStyle = `rgba(50, 120, 255, ${overlays.opacity * 0.5 * tumorIntensity})`;
			ctx.beginPath();
			ctx.ellipse(
				tumorX + tumorR * 0.1,
				tumorY,
				tumorR * 0.4,
				tumorR * 0.35,
				0,
				0,
				Math.PI * 2,
			);
			ctx.fill();
			ctx.strokeStyle = `rgba(50, 120, 255, ${overlays.opacity * 0.8 * tumorIntensity})`;
			ctx.lineWidth = 1.5;
			ctx.stroke();
		}
	}

	// HUD overlay
	ctx.fillStyle = "rgba(0, 200, 180, 0.7)";
	ctx.font = "11px monospace";
	ctx.fillText(`Slice: ${slice + 1}/${total}`, 12, 20);
	ctx.fillText(`W: ${w} L: ${Math.round(w / 2)}`, 12, 36);

	// Orientation markers
	ctx.fillStyle = "rgba(0, 200, 180, 0.5)";
	ctx.font = "13px monospace";
	ctx.fillText("A", cx - 4, 18);
	ctx.fillText("P", cx - 4, h - 8);
	ctx.fillText("R", 8, cy + 4);
	ctx.fillText("L", w - 16, cy + 4);
}

export const SliceViewer = ({ overlays }: SliceViewerProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [slice, setSlice] = useState(78);

	const render = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		drawSlice(ctx, canvas.width, canvas.height, slice, TOTAL_SLICES, overlays);
	}, [slice, overlays]);

	useEffect(() => {
		render();
	}, [render]);

	// Resize canvas to fit container
	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;

		const observer = new ResizeObserver((entries) => {
			const { width } = entries[0].contentRect;
			const size = Math.min(Math.round(width), CANVAS_SIZE);
			canvas.width = size;
			canvas.height = size;
			render();
		});

		observer.observe(container);
		return () => observer.disconnect();
	}, [render]);

	return (
		<div className="space-y-3">
			<div
				ref={containerRef}
				className="relative bg-foreground/5 rounded-xl overflow-hidden border border-border"
			>
				<canvas
					ref={canvasRef}
					width={CANVAS_SIZE}
					height={CANVAS_SIZE}
					className="w-full block mx-auto"
					style={{ maxWidth: CANVAS_SIZE }}
				/>
			</div>
			<div className="flex items-center gap-3 sm:gap-4 px-1">
				<span className="text-xs font-mono text-muted-foreground w-14 shrink-0">
					Slice {slice + 1}
				</span>
				<Slider
					value={[slice]}
					onValueChange={([v]) => setSlice(v)}
					min={0}
					max={TOTAL_SLICES - 1}
					step={1}
					className="flex-1"
				/>
				<span className="text-xs font-mono text-muted-foreground w-8 text-right shrink-0">
					{TOTAL_SLICES}
				</span>
			</div>
		</div>
	);
};
