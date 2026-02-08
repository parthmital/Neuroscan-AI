import { Loader2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useScans } from "@/hooks/use-data";
import { useConfig } from "@/hooks/use-config";
import { MRIScan, AppConfig } from "@/lib/types";

export const ProcessingQueue = () => {
	const { data: scans, isLoading: scansLoading } = useScans();
	const { data: config, isLoading: configLoading } = useConfig();

	if (scansLoading || configLoading || !scans || !config) {
		return <div className="bg-card rounded-xl border border-border p-6 h-48" />;
	}

	const queuedScans = (scans as MRIScan[]).filter(
		(s) =>
			s.status === "processing" ||
			s.status === "queued" ||
			s.status === "uploading",
	);

	if (queuedScans.length === 0) {
		return (
			<div className="bg-card rounded-xl border border-border p-6">
				<h2 className="text-sm font-semibold text-foreground mb-4">
					{(config as AppConfig).processingQueue.title}
				</h2>
				<div className="text-center py-8 text-muted-foreground">
					<Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
					<p className="text-sm">
						{(config as AppConfig).processingQueue.noScans}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-card rounded-xl border border-border p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-sm font-semibold text-foreground">
					{(config as AppConfig).processingQueue.title}
				</h2>
				<span className="text-xs text-muted-foreground">
					{queuedScans.length} item{queuedScans.length > 1 ? "s" : ""}
				</span>
			</div>
			<div className="space-y-4">
				{queuedScans.map((scan) => (
					<div key={scan.id} className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								{scan.status === "processing" ? (
									<Loader2 className="w-3.5 h-3.5 text-medical" />
								) : (
									<Clock className="w-3.5 h-3.5 text-info" />
								)}
								<span className="text-sm font-medium text-foreground">
									{scan.patientName}
								</span>
								<span className="text-xs text-muted-foreground">
									{scan.patientId}
								</span>
							</div>
							<span className="text-xs font-medium text-muted-foreground capitalize">
								{scan.pipelineStep}
							</span>
						</div>
						<Progress
							value={scan.progress}
							className={cn(
								"h-1.5",
								scan.status === "processing"
									? "[&>div]:bg-medical"
									: "[&>div]:bg-info/50",
							)}
						/>
						<p className="text-[11px] text-muted-foreground">
							{scan.progress}% complete · {scan.modalities.join(", ")}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};
