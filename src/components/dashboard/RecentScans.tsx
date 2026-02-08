import { useNavigate } from "react-router-dom";
import { Eye, RotateCcw, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useScans } from "@/hooks/use-data";
import { useConfig } from "@/hooks/use-config";
import { MRIScan, AppConfig } from "@/lib/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const RecentScans = () => {
	const navigate = useNavigate();
	const { data: scans, isLoading: scansLoading } = useScans();
	const { data: config, isLoading: configLoading } = useConfig();

	if (scansLoading || configLoading || !scans || !config) {
		return <div className="h-64 bg-card rounded-xl border border-border" />;
	}

	const statusStyles: Record<string, string> = {
		success: "bg-success/10 text-success",
		medical: "bg-medical-light text-medical",
		info: "bg-info/10 text-info",
		destructive: "bg-destructive/10 text-destructive",
		warning: "bg-warning/10 text-warning",
	};

	return (
		<div className="bg-card rounded-xl border border-border overflow-hidden">
			<div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
				<h2 className="text-sm font-semibold text-foreground">
					{(config as AppConfig).dashboard.recentScansTitle}
				</h2>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate("/scans")}
					className="text-xs text-muted-foreground"
				>
					{(config as AppConfig).dashboard.viewAllLabel}
				</Button>
			</div>

			{/* Mobile card view */}
			<div className="sm:hidden divide-y divide-border">
				{(scans as MRIScan[]).slice(0, 6).map((scan) => {
					const statusInfo = (config as AppConfig).statusConfig[
						scan.status
					] || { label: scan.status, color: "muted" };
					return (
						<div
							key={scan.id}
							className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
							onClick={() => navigate(`/scan/${scan.id}`)}
						>
							<div className="flex items-start justify-between mb-2">
								<div>
									<p className="text-sm font-medium text-foreground">
										{scan.patientName}
									</p>
									<p className="text-xs text-muted-foreground">
										{scan.patientId}
									</p>
								</div>
								<span
									className={cn(
										"inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full",
										statusStyles[statusInfo.color] ||
											"bg-muted text-muted-foreground",
									)}
								>
									{statusInfo.label}
								</span>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>{scan.scanDate}</span>
								<span>·</span>
								<span>
									{scan.results
										? scan.results.detected
											? scan.results.classification
											: "No Tumour"
										: "Pending"}
								</span>
							</div>
						</div>
					);
				})}
			</div>

			{/* Desktop table view */}
			<div className="hidden sm:block overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
								Patient
							</TableHead>
							<TableHead className="text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">
								Date
							</TableHead>
							<TableHead className="text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden lg:table-cell">
								Modalities
							</TableHead>
							<TableHead className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
								Status
							</TableHead>
							<TableHead className="text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden md:table-cell">
								Result
							</TableHead>
							<TableHead className="w-[80px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{(scans as MRIScan[]).slice(0, 6).map((scan) => {
							const statusInfo = (config as AppConfig).statusConfig[
								scan.status
							] || { label: scan.status, color: "muted" };
							return (
								<TableRow
									key={scan.id}
									className="cursor-pointer group"
									onClick={() => navigate(`/scan/${scan.id}`)}
								>
									<TableCell>
										<div>
											<p className="text-sm font-medium text-foreground">
												{scan.patientName}
											</p>
											<p className="text-xs text-muted-foreground">
												{scan.patientId}
											</p>
										</div>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground hidden md:table-cell">
										{scan.scanDate}
									</TableCell>
									<TableCell className="hidden lg:table-cell">
										<div className="flex gap-1">
											{scan.modalities.map((m: string) => (
												<span
													key={m}
													className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-muted text-muted-foreground"
												>
													{m}
												</span>
											))}
										</div>
									</TableCell>
									<TableCell>
										<span
											className={cn(
												"inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-full",
												statusStyles[statusInfo.color] ||
													"bg-muted text-muted-foreground",
											)}
										>
											{statusInfo.label}
										</span>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										<span className="text-sm text-muted-foreground">
											{scan.results
												? scan.results.detected
													? scan.results.classification
													: "No Tumour"
												: "—"}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
												<Eye className="w-3.5 h-3.5" />
											</button>
											{scan.status === "failed" && (
												<button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
													<RotateCcw className="w-3.5 h-3.5" />
												</button>
											)}
											<button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
												<MoreHorizontal className="w-3.5 h-3.5" />
											</button>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
