import { DropZone } from "@/components/upload/DropZone";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/use-config";
import { AppConfig } from "@/lib/types";

const Upload = () => {
	const navigate = useNavigate();
	const { data: config, isLoading } = useConfig();

	if (isLoading || !config) {
		return (
			<div className="animate-pulse space-y-6">
				<div className="h-10 w-24 rounded-xl bg-muted" />
				<div className="h-20 w-3/4 rounded-xl bg-muted" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate("/")}
					className="text-muted-foreground"
				>
					<ArrowLeft className="mr-1 h-4 w-4" />
					{(config as AppConfig).upload.backButton}
				</Button>
			</div>

			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground">
					{(config as AppConfig).upload.title}
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					{(config as AppConfig).upload.subtitle}
				</p>
			</div>

			<DropZone />
		</div>
	);
};

export default Upload;
