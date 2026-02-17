import type { ScanStatus } from "./types";

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
