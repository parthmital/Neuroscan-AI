const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchScans = async () => {
	const response = await fetch(`${API_BASE_URL}/scans`, {
		headers: { ...getAuthHeader() },
	});
	if (!response.ok) throw new Error("Failed to fetch scans");
	return response.json();
};

export const fetchScan = async (id: string) => {
	const response = await fetch(`${API_BASE_URL}/scans/${id}`, {
		headers: { ...getAuthHeader() },
	});
	if (!response.ok) throw new Error("Failed to fetch scan");
	return response.json();
};

export const processMRI = async (files: File[]) => {
	const formData = new FormData();
	files.forEach((file) => formData.append("files", file));

	const response = await fetch(`${API_BASE_URL}/process-mri`, {
		method: "POST",
		headers: { ...getAuthHeader() },
		body: formData,
	});
	if (!response.ok) throw new Error("Failed to process MRI");
	return response.json();
};
