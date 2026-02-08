import { useNavigate, useLocation } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScans } from "@/hooks/use-data";
import { useConfig } from "@/hooks/use-config";
import { MRIScan, AppConfig } from "@/lib/types";

const ScanLibrary = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const querySearch = new URLSearchParams(location.search).get("search") || "";
	const [search, setSearch] = useState(querySearch);
	const [filter, setFilter] = useState<string>("all");
	const { data: scans, isLoading: scansLoading } = useScans();
	const { data: config, isLoading: configLoading } = useConfig();

	useEffect(() => {
		setSearch(querySearch);
	}, [querySearch]);

	if (scansLoading || configLoading || !scans || !config) {
		return (
			<div className="space-y-6">
				<div className="h-20 bg-muted rounded-xl w-1/3" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-48 bg-muted rounded-xl" />
					))}
				</div>
			</div>
		);
	}

	const filtered = scans.filter((s: MRIScan) => {
		const matchesSearch =
			s.patientName.toLowerCase().includes(search.toLowerCase()) ||
			s.patientId.toLowerCase().includes(search.toLowerCase());
		const matchesFilter = filter === "all" || s.status === filter;
		return matchesSearch && matchesFilter;
	});

	const filters = ["all", ...Object.keys(config.statusConfig)];

	const statusStyles: Record<string, string> = {
		success: "bg-success/10 text-success",
		medical: "bg-medical-light text-medical",
		info: "bg-info/10 text-info",
		destructive: "bg-destructive/10 text-destructive",
		warning: "bg-warning/10 text-warning",
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-foreground tracking-tight">
					{config.scanLibrary.title}
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					{config.scanLibrary.subtitle}
				</p>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder={config.scanLibrary.searchPlaceholder}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 h-9 bg-muted/50 border-none text-sm"
					/>
				</div>
				<div className="flex gap-1.5 flex-wrap">
					{filters.map((f) => {
						const label =
							f === "all" ? "All" : config.statusConfig[f]?.label || f;
						return (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={cn(
									"px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
									filter === f
										? "bg-medical text-medical-foreground"
										: "bg-muted text-muted-foreground hover:text-foreground",
								)}
							>
								{label}
							</button>
						);
					})}
				</div>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{filtered.map((scan: MRIScan) => {
					const statusInfo = config.statusConfig[scan.status] || {
						label: scan.status,
						color: "muted",
					};
					return (
						<div
							key={scan.id}
							onClick={() => navigate(`/scan/${scan.id}`)}
							className="bg-card rounded-xl border border-border p-5 cursor-pointer group hover:border-medical/30 hover:shadow-md transition-all"
						>
							<div className="flex items-start justify-between mb-3">
								<div>
									<p className="text-sm font-semibold text-foreground group-hover:text-medical transition-colors">
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

							<div className="flex items-center gap-2 mb-3">
								{scan.modalities.map((m) => (
									<span
										key={m}
										className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-muted text-muted-foreground"
									>
										{m}
									</span>
								))}
								<span className="text-xs text-muted-foreground ml-auto">
									{scan.scanDate}
								</span>
							</div>

							{scan.results && (
								<div className="pt-3 border-t border-border">
									<p className="text-xs text-muted-foreground">
										{scan.results.detected
											? `${scan.results.classification} · ${scan.results.tumorVolume} cm³`
											: "No tumour detected"}
									</p>
								</div>
							)}

							<div className="flex justify-end mt-3">
								<Button
									variant="ghost"
									size="sm"
									className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<Eye className="w-3.5 h-3.5 mr-1" />
									View
								</Button>
							</div>
						</div>
					);
				})}
			</div>

			{filtered.length === 0 && (
				<div className="text-center py-16 text-muted-foreground">
					<p className="text-sm font-medium">
						{config.scanLibrary.noScansFound}
					</p>
					<p className="text-xs mt-1">{config.scanLibrary.adjustFilters}</p>
				</div>
			)}
		</div>
	);
};

export default ScanLibrary;
