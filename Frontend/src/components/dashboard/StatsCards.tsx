import {
	Brain,
	Loader2,
	CheckCircle2,
	AlertTriangle,
	HelpCircle,
	LucideIcon,
} from "lucide-react";
import { useScans } from "@/hooks/use-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
	total: Brain,
	processing: Loader2,
	completed: CheckCircle2,
	flagged: AlertTriangle,
};

const colorMap: Record<string, string> = {
	total: "text-medical bg-medical-light",
	processing: "text-info bg-info/10",
	completed: "text-success bg-success/10",
	flagged: "text-warning bg-warning/10",
};

export const StatsCards = () => {
	const { data: scans, isLoading } = useScans();

	const stats = scans
		? [
				{ label: "Total Scans", value: scans.length, type: "total" },
				{
					label: "Processing",
					value: 0,
					type: "processing",
				},
				{
					label: "Completed",
					value: scans.length,
					type: "completed",
				},
				{
					label: "Flagged",
					value: scans.filter((s) => s.results?.detected).length,
					type: "flagged",
				},
			]
		: null;

	if (isLoading || !stats) {
		return (
			<div className="grid grid-cols-4 gap-5">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="h-32 animate-pulse rounded-xl border border-border bg-card p-5"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-4 gap-5">
			{stats.map((stat, index) => {
				const Icon = iconMap[stat.type] || HelpCircle;
				return (
					<div
						key={stat.label}
						className={cn("rounded-xl border border-border bg-card p-5")}
					>
						<div className="mb-3 flex items-center justify-between">
							<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								{stat.label}
							</span>
							<div
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-lg",
									colorMap[stat.type] || "bg-muted text-muted-foreground",
								)}
							>
								<Icon className={cn("w-4.5 h-4.5")} />
							</div>
						</div>
						<p className="text-3xl font-bold tracking-tight text-foreground">
							{stat.value}
						</p>
					</div>
				);
			})}
		</div>
	);
};
