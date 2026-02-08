import { useRef, useEffect, useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { cn, hexToRgba } from "@/lib/utils";

interface Overlays {
	wt: boolean;
	tc: boolean;
	et: boolean;
	opacity: number;
}

interface SliceViewerProps {
	scanId?: string;
	modalities?: string[];
	overlays: Overlays;
	overlayColors?: {
		wt: string;
		tc: string;
		et: string;
	};
}

const DEFAULT_TOTAL_SLICES = 155;
const CANVAS_SIZE = 480;

export const SliceViewer = ({
	scanId,
	modalities,
	overlays,
	overlayColors,
}: SliceViewerProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [slice, setSlice] = useState(78);
	const [totalSlices, setTotalSlices] = useState(DEFAULT_TOTAL_SLICES);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedModality, setSelectedModality] = useState(
		modalities?.[0] || "FLAIR",
	);

	const fetchSlice = useCallback(async () => {
		if (!scanId || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:8000/api/scans/${scanId}/slice/${slice}?modality=${selectedModality.toLowerCase()}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response.ok) throw new Error("Failed to fetch slice");

			// Update total slices if header is present
			const total = response.headers.get("X-Total-Slices");
			if (total) setTotalSlices(parseInt(total));

			const blob = await response.blob();
			const img = new Image();
			img.onload = () => {
				// Clear canvas
				ctx.fillStyle = "#0a0a0a";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				// Draw image centered and scaled
				const scale = Math.min(
					canvas.width / img.width,
					canvas.height / img.height,
				);
				const x = (canvas.width - img.width * scale) / 2;
				const y = (canvas.height - img.height * scale) / 2;
				ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

				// HUD overlay
				ctx.fillStyle = "rgba(0, 200, 180, 0.7)";
				ctx.font = "11px monospace";
				ctx.fillText(`Slice: ${slice + 1}/${totalSlices}`, 12, 20);
				ctx.fillText(`Modality: ${selectedModality}`, 12, 36);

				// Orientation markers
				ctx.fillStyle = "rgba(0, 200, 180, 0.5)";
				ctx.font = "13px monospace";
				ctx.fillText("A", canvas.width / 2 - 4, 18);
				ctx.fillText("P", canvas.width / 2 - 4, canvas.height - 8);
				ctx.fillText("R", 8, canvas.height / 2 + 4);
				ctx.fillText("L", canvas.width - 16, canvas.height / 2 + 4);

				setIsLoading(false);
			};
			img.src = URL.createObjectURL(blob);
		} catch (error) {
			console.error("Error fetching slice:", error);
			setIsLoading(false);
		}
	}, [scanId, slice, selectedModality, totalSlices]);

	useEffect(() => {
		if (scanId) {
			fetchSlice();
		}
	}, [fetchSlice, scanId]);

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
			if (scanId) fetchSlice();
		});

		observer.observe(container);
		return () => observer.disconnect();
	}, [fetchSlice, scanId]);

	return (
		<div className="space-y-3">
			<div
				ref={containerRef}
				className="relative bg-black rounded-xl overflow-hidden border border-border aspect-square"
			>
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 border-2 border-medical border-t-transparent rounded-full animate-spin" />
							<p className="text-[10px] text-medical font-mono tracking-widest uppercase">
								Loading Slice
							</p>
						</div>
					</div>
				)}
				<canvas
					ref={canvasRef}
					width={CANVAS_SIZE}
					height={CANVAS_SIZE}
					className="w-full block mx-auto"
					style={{ maxWidth: CANVAS_SIZE }}
				/>

				{/* Modality Selector Overlay */}
				{modalities && modalities.length > 0 && (
					<div className="absolute top-4 right-4 flex gap-1">
						{modalities.map((m) => (
							<button
								key={m}
								onClick={() => setSelectedModality(m)}
								className={cn(
									"px-2 py-1 text-[10px] font-bold rounded border transition-all",
									selectedModality === m
										? "bg-medical text-medical-foreground border-medical"
										: "bg-black/60 text-white/60 border-white/20 hover:border-medical/50",
								)}
							>
								{m}
							</button>
						))}
					</div>
				)}
			</div>
			<div className="flex items-center gap-3 sm:gap-4 px-1">
				<span className="text-xs font-mono text-muted-foreground w-14 shrink-0">
					Slice {slice + 1}
				</span>
				<Slider
					value={[slice]}
					onValueChange={([v]) => setSlice(v)}
					min={0}
					max={totalSlices - 1}
					step={1}
					className="flex-1"
				/>
				<span className="text-xs font-mono text-muted-foreground w-8 text-right shrink-0">
					{totalSlices}
				</span>
			</div>
		</div>
	);
};
