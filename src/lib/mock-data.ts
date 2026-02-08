export type ScanStatus =
	| "uploading"
	| "queued"
	| "processing"
	| "completed"
	| "failed";
export type Modality = "FLAIR" | "T1" | "T1CE" | "T2";
export type PipelineStep =
	| "detection"
	| "classification"
	| "segmentation"
	| "complete";

export interface ScanResult {
	detected: boolean;
	classification: string;
	confidence: number;
	tumorVolume: number;
	wtVolume: number;
	tcVolume: number;
	etVolume: number;
}

export interface MRIScan {
	id: string;
	patientId: string;
	patientName: string;
	scanDate: string;
	modalities: Modality[];
	status: ScanStatus;
	progress: number;
	pipelineStep: PipelineStep;
	results?: ScanResult;
}

export const mockScans: MRIScan[] = [
	{
		id: "scan-001",
		patientId: "PT-2024-0847",
		patientName: "J. Morrison",
		scanDate: "2026-02-07",
		modalities: ["FLAIR", "T1", "T1CE", "T2"],
		status: "completed",
		progress: 100,
		pipelineStep: "complete",
		results: {
			detected: true,
			classification: "High-Grade Glioma (HGG)",
			confidence: 0.94,
			tumorVolume: 42.8,
			wtVolume: 38.2,
			tcVolume: 18.5,
			etVolume: 12.3,
		},
	},
	{
		id: "scan-002",
		patientId: "PT-2024-0912",
		patientName: "S. Chen",
		scanDate: "2026-02-07",
		modalities: ["FLAIR", "T1", "T1CE", "T2"],
		status: "processing",
		progress: 65,
		pipelineStep: "segmentation",
	},
	{
		id: "scan-003",
		patientId: "PT-2024-0756",
		patientName: "A. Kowalski",
		scanDate: "2026-02-06",
		modalities: ["FLAIR", "T1", "T2"],
		status: "completed",
		progress: 100,
		pipelineStep: "complete",
		results: {
			detected: false,
			classification: "No Tumour Detected",
			confidence: 0.98,
			tumorVolume: 0,
			wtVolume: 0,
			tcVolume: 0,
			etVolume: 0,
		},
	},
	{
		id: "scan-004",
		patientId: "PT-2024-0623",
		patientName: "R. Patel",
		scanDate: "2026-02-06",
		modalities: ["T1", "T1CE"],
		status: "failed",
		progress: 30,
		pipelineStep: "classification",
	},
	{
		id: "scan-005",
		patientId: "PT-2024-1003",
		patientName: "M. Dubois",
		scanDate: "2026-02-06",
		modalities: ["FLAIR", "T1", "T1CE", "T2"],
		status: "queued",
		progress: 0,
		pipelineStep: "detection",
	},
	{
		id: "scan-006",
		patientId: "PT-2024-0489",
		patientName: "L. Andersson",
		scanDate: "2026-02-05",
		modalities: ["FLAIR", "T1", "T1CE", "T2"],
		status: "completed",
		progress: 100,
		pipelineStep: "complete",
		results: {
			detected: true,
			classification: "Low-Grade Glioma (LGG)",
			confidence: 0.87,
			tumorVolume: 15.4,
			wtVolume: 12.1,
			tcVolume: 6.3,
			etVolume: 2.8,
		},
	},
	{
		id: "scan-007",
		patientId: "PT-2024-0334",
		patientName: "K. Nakamura",
		scanDate: "2026-02-05",
		modalities: ["FLAIR", "T1", "T1CE", "T2"],
		status: "completed",
		progress: 100,
		pipelineStep: "complete",
		results: {
			detected: true,
			classification: "High-Grade Glioma (HGG)",
			confidence: 0.91,
			tumorVolume: 56.2,
			wtVolume: 48.7,
			tcVolume: 25.1,
			etVolume: 18.9,
		},
	},
	{
		id: "scan-008",
		patientId: "PT-2024-1128",
		patientName: "E. Williams",
		scanDate: "2026-02-04",
		modalities: ["FLAIR", "T2"],
		status: "processing",
		progress: 25,
		pipelineStep: "detection",
	},
];

export const getStatusColor = (status: ScanStatus) => {
	switch (status) {
		case "completed":
			return "success";
		case "processing":
			return "medical";
		case "queued":
			return "info";
		case "failed":
			return "destructive";
		case "uploading":
			return "warning";
		default:
			return "muted";
	}
};

export const getStatusLabel = (status: ScanStatus) => {
	switch (status) {
		case "completed":
			return "Completed";
		case "processing":
			return "Processing";
		case "queued":
			return "Queued";
		case "failed":
			return "Failed";
		case "uploading":
			return "Uploading";
		default:
			return status;
	}
};
