import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileImage, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Modality } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthContext";

interface UploadedFile {
	id: string;
	name: string;
	size: number;
	modality?: Modality;
	status: "ready" | "processing" | "done" | "error";
	file: File;
}

const MODALITIES: Modality[] = ["FLAIR", "T1", "T1CE", "T2"];

export const DropZone = () => {
	const navigate = useNavigate();
	const [isDragging, setIsDragging] = useState(false);
	const [files, setFiles] = useState<UploadedFile[]>([]);
	const [selectedModalities, setSelectedModalities] = useState<Set<Modality>>(
		new Set(MODALITIES),
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback(() => {
		setIsDragging(false);
	}, []);

	const addFiles = useCallback((newFiles: File[]) => {
		const uploadFiles: UploadedFile[] = newFiles.map((f) => ({
			id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
			name: f.name,
			size: f.size,
			modality: detectModality(f.name),
			status: "ready" as const,
			file: f,
		}));
		setFiles((prev) => [...prev, ...uploadFiles]);
	}, []);

	const detectModality = (filename: string): Modality | undefined => {
		const upper = filename.toUpperCase();
		if (upper.includes("FLAIR")) return "FLAIR";
		if (upper.includes("T1CE") || upper.includes("T1C")) return "T1CE";
		if (upper.includes("T1")) return "T1";
		if (upper.includes("T2")) return "T2";
		return undefined;
	};

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const droppedFiles = Array.from(e.dataTransfer.files);
			addFiles(droppedFiles);
		},
		[addFiles],
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files) {
				addFiles(Array.from(e.target.files));
			}
		},
		[addFiles],
	);

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((f) => f.id !== id));
	};

	const toggleModality = (mod: Modality) => {
		setSelectedModalities((prev) => {
			const next = new Set(prev);
			if (next.has(mod)) next.delete(mod);
			else next.add(mod);
			return next;
		});
	};

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const { token } = useAuth();

	const [patientName, setPatientName] = useState("");
	const [patientId, setPatientId] = useState("");

	const handleStartProcessing = async () => {
		if (files.length === 0) return;

		setFiles((prev) => prev.map((f) => ({ ...f, status: "processing" })));

		const formData = new FormData();
		files.forEach((f) => {
			formData.append("files", f.file);
		});
		formData.append("patientName", patientName || "Uploaded Scan");
		formData.append("patientId", patientId);

		try {
			const response = await fetch("http://localhost:8000/api/process-mri", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			if (!response.ok) throw new Error("Processing failed");

			const result = await response.json();
			console.log("Processing result:", result);

			setFiles((prev) => prev.map((f) => ({ ...f, status: "done" })));

			// Navigate to ScanDetail with the real data
			setTimeout(() => {
				navigate(`/scan/${result.id}`, { state: { scanResult: result } });
			}, 500);
		} catch (error) {
			console.error("Upload error:", error);
			setFiles((prev) => prev.map((f) => ({ ...f, status: "error" })));
		}
	};

	const missingModalities = MODALITIES.filter(
		(m) => selectedModalities.has(m) && !files.some((f) => f.modality === m),
	);

	return (
		<div className="space-y-6">
			{/* Drop area */}
			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					"group relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200",
					isDragging
						? "scale-[1.01] border-medical bg-medical-light/50"
						: "border-border hover:border-medical/40 hover:bg-muted/30",
				)}
				onClick={() => document.getElementById("file-input")?.click()}
			>
				<input
					id="file-input"
					type="file"
					multiple
					accept=".nii,.nii.gz,.dcm,.dicom"
					className="hidden"
					onChange={handleFileInput}
				/>
				<div
					className={cn(
						"mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
						isDragging
							? "bg-medical text-medical-foreground"
							: "bg-muted text-muted-foreground group-hover:bg-medical/10 group-hover:text-medical",
					)}
				>
					<Upload className="h-7 w-7" />
				</div>
				<h3 className="mb-1 text-lg font-semibold text-foreground">
					Drop your MRI files here
				</h3>
				<p className="mb-3 text-sm text-muted-foreground">
					or click to browse. Supports NIfTI (.nii, .nii.gz) and DICOM (.dcm)
					formats.
				</p>
				<p className="text-xs text-muted-foreground/70">
					Batch upload supported · Multi-modal MRI (FLAIR, T1, T1CE, T2)
				</p>
			</div>

			{/* Patient Details */}
			{files.length > 0 && (
				<div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-muted/30 p-5 sm:grid-cols-2">
					<div className="space-y-2">
						<label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Patient Name
						</label>
						<Input
							placeholder="e.g. John Doe"
							value={patientName}
							onChange={(e) => setPatientName(e.target.value)}
							className="border-border/50 bg-background"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Patient ID (Optional)
						</label>
						<Input
							placeholder="e.g. PT-10492"
							value={patientId}
							onChange={(e) => setPatientId(e.target.value)}
							className="border-border/50 bg-background"
						/>
					</div>
				</div>
			)}

			{/* Modality selector */}
			<div>
				<label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Expected Modalities
				</label>
				<div className="flex gap-2">
					{MODALITIES.map((mod) => (
						<button
							key={mod}
							onClick={() => toggleModality(mod)}
							className={cn(
								"rounded-lg px-4 py-2 text-sm font-medium transition-all",
								selectedModalities.has(mod)
									? "bg-medical text-medical-foreground shadow-sm"
									: "bg-muted text-muted-foreground hover:bg-muted/80",
							)}
						>
							{mod}
						</button>
					))}
				</div>
			</div>

			{/* Missing modality warning */}
			{files.length > 0 && missingModalities.length > 0 && (
				<div className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/10 p-4">
					<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
					<div>
						<p className="text-sm font-medium text-foreground">
							Missing modalities detected
						</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							The following expected modalities have not been uploaded:{" "}
							<strong>{missingModalities.join(", ")}</strong>. This may affect
							processing accuracy.
						</p>
					</div>
				</div>
			)}

			{/* File list */}
			{files.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Uploaded Files ({files.length})
						</label>
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground"
							onClick={() => setFiles([])}
						>
							Clear All
						</Button>
					</div>
					<div className="space-y-1.5">
						{files.map((file) => (
							<div
								key={file.id}
								className="group flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"
							>
								<FileImage className="h-4 w-4 shrink-0 text-medical" />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-foreground">
										{file.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatSize(file.size)}
										{file.modality && (
											<span className="ml-2 rounded bg-medical/10 px-1.5 py-0.5 text-[10px] font-semibold text-medical">
												{file.modality}
											</span>
										)}
									</p>
								</div>
								{file.status === "done" && (
									<CheckCircle2 className="h-4 w-4 text-success" />
								)}
								<button
									onClick={() => removeFile(file.id)}
									className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
								>
									<X className="h-3.5 w-3.5" />
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Action */}
			{files.length > 0 && (
				<div className="flex justify-end">
					<Button
						onClick={handleStartProcessing}
						disabled={files.some((f) => f.status === "processing")}
						className="gap-2 bg-medical px-8 text-medical-foreground hover:bg-medical/90"
					>
						<Upload className="h-4 w-4" />
						{files.some((f) => f.status === "processing")
							? "Processing..."
							: `Start Processing (${files.length} file${files.length > 1 ? "s" : ""})`}
					</Button>
				</div>
			)}
		</div>
	);
};
