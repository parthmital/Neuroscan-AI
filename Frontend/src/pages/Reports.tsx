import { useNavigate } from "react-router-dom";
import { Download, FileText, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScans } from "@/hooks/use-data";
import { useConfig } from "@/hooks/use-config";
import { MRIScan, AppConfig } from "@/lib/types";

const Reports = () => {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const { data: scans, isLoading: scansLoading } = useScans();
	const { data: config, isLoading: configLoading } = useConfig();

	if (scansLoading || configLoading || !scans || !config) {
		return (
			<div className="animate-pulse space-y-6">
				<div className="h-20 w-1/2 rounded-xl bg-muted" />
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-24 rounded-xl bg-muted" />
					))}
				</div>
			</div>
		);
	}

	const completedScans = scans.filter((s: MRIScan) => s.status === "completed");

	const filtered = completedScans.filter(
		(s: MRIScan) =>
			s.patientName.toLowerCase().includes(search.toLowerCase()) ||
			s.patientId.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						{(config as AppConfig).reports.title}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{(config as AppConfig).reports.subtitle}
					</p>
				</div>
				<Button variant="outline" size="sm" className="gap-1.5 text-xs">
					<Download className="h-3.5 w-3.5" />
					{(config as AppConfig).reports.exportAll}
				</Button>
			</div>

			{/* Filters */}
			<div className="flex items-center gap-4">
				<div className="relative w-72">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder={(config as AppConfig).reports.searchPlaceholder}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-9 border-none bg-muted/50 pl-9 text-sm"
					/>
				</div>
			</div>

			{/* Report cards */}
			<div className="space-y-3">
				{filtered.map((scan) => (
					<div
						key={scan.id}
						className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-medical/30 hover:shadow-md"
						onClick={() => navigate(`/scan/${scan.id}`)}
					>
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-medical/10">
								<FileText className="h-5 w-5 text-medical" />
							</div>
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-foreground">
									{scan.patientName} — AI Analysis Report
								</p>
								<div className="mt-0.5 flex items-center gap-2">
									<span className="text-xs text-muted-foreground">
										{scan.patientId}
									</span>
									<span className="text-xs text-muted-foreground">·</span>
									<span className="text-xs text-muted-foreground">
										{scan.scanDate}
									</span>
									{scan.results && (
										<>
											<span className="mr-1 text-xs text-muted-foreground">
												·
											</span>
											<span
												className={cn(
													"text-xs font-medium",
													scan.results.detected
														? "text-warning"
														: "text-success",
												)}
											>
												{scan.results.detected
													? scan.results.classification
													: "No Tumour"}
											</span>
										</>
									)}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							{scan.modalities.map((m) => (
								<span
									key={m}
									className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
								>
									{m}
								</span>
							))}
						</div>

						<div className="flex shrink-0 items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5 text-xs"
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<Download className="h-3.5 w-3.5" />
								PDF
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5 text-xs"
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<Download className="h-3.5 w-3.5" />
								CSV
							</Button>
						</div>
					</div>
				))}
			</div>

			{filtered.length === 0 && (
				<div className="py-16 text-center text-muted-foreground">
					<FileText className="mx-auto mb-3 h-10 w-10 opacity-30" />
					<p className="text-sm font-medium">
						{(config as AppConfig).reports.noReportsFound}
					</p>
					<p className="mt-1 text-xs">
						{(config as AppConfig).reports.autoGenerated}
					</p>
				</div>
			)}
		</div>
	);
};

export default Reports;
