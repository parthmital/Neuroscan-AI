import { useEffect, useRef, useState } from "react";
import * as cornerstone from "@cornerstonejs/core";
import * as cornerstoneTools from "@cornerstonejs/tools";
import {
	cornerstoneNiftiImageLoader,
	init as initNiftiLoader,
	createNiftiImageIdsAndCacheMetadata,
} from "@cornerstonejs/nifti-volume-loader";

let isCornerstoneInitialized = false;

const initializeCornerstone = async () => {
	if (isCornerstoneInitialized) return;

	await cornerstone.init();
	await cornerstoneTools.init();

	// Initialize and register the NIFTI image loader
	initNiftiLoader();
	cornerstone.imageLoader.registerImageLoader(
		"nifti",
		cornerstoneNiftiImageLoader,
	);

	// add tools
	cornerstoneTools.addTool(cornerstoneTools.WindowLevelTool);
	cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
	cornerstoneTools.addTool(cornerstoneTools.PanTool);
	cornerstoneTools.addTool(cornerstoneTools.TrackballRotateTool);

	isCornerstoneInitialized = true;
};

interface QuadViewerProps {
	scanId: string;
	modality?: string;
}

export const QuadViewer = ({ scanId, modality = "flair" }: QuadViewerProps) => {
	const axialRef = useRef<HTMLDivElement>(null);
	const sagittalRef = useRef<HTMLDivElement>(null);
	const coronalRef = useRef<HTMLDivElement>(null);
	const volume3DRef = useRef<HTMLDivElement>(null);

	const renderingEngineId = useRef("quadViewEngine");
	const [isReady, setIsReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		initializeCornerstone().then(() => setIsReady(true));

		const engineId = renderingEngineId.current;
		return () => {
			const engine = cornerstone.getRenderingEngine(engineId);
			if (engine) engine.destroy();
		};
	}, []);

	useEffect(() => {
		if (
			!isReady ||
			!axialRef.current ||
			!sagittalRef.current ||
			!coronalRef.current ||
			!volume3DRef.current ||
			!scanId
		)
			return;

		const engineId = renderingEngineId.current;
		const toolGroupId = `QuadToolGroup-${scanId}`;

		const loadVolumes = async () => {
			setIsLoading(true);
			try {
				const renderingEngine = new cornerstone.RenderingEngine(engineId);

				// Define viewports
				const viewportInputs = [
					{
						viewportId: "AXIAL",
						type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
						element: axialRef.current!,
						defaultOptions: {
							orientation: cornerstone.Enums.OrientationAxis.AXIAL,
							background: [0, 0, 0] as [number, number, number],
						},
					},
					{
						viewportId: "SAGITTAL",
						type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
						element: sagittalRef.current!,
						defaultOptions: {
							orientation: cornerstone.Enums.OrientationAxis.SAGITTAL,
							background: [0, 0, 0] as [number, number, number],
						},
					},
					{
						viewportId: "CORONAL",
						type: cornerstone.Enums.ViewportType.ORTHOGRAPHIC,
						element: coronalRef.current!,
						defaultOptions: {
							orientation: cornerstone.Enums.OrientationAxis.CORONAL,
							background: [0, 0, 0] as [number, number, number],
						},
					},
					{
						viewportId: "VOLUME_3D",
						type: cornerstone.Enums.ViewportType.VOLUME_3D,
						element: volume3DRef.current!,
						defaultOptions: {
							background: [0, 0, 0] as [number, number, number],
						},
					},
				];

				// Enable all viewports
				viewportInputs.forEach((input) => {
					renderingEngine.enableElement(input);
				});

				// Setup tools - separate groups for 2D and 3D
				const toolGroup2DId = `${toolGroupId}-2D`;
				const toolGroup3DId = `${toolGroupId}-3D`;

				// 2D Tool Group
				let toolGroup2D =
					cornerstoneTools.ToolGroupManager.getToolGroup(toolGroup2DId);
				if (!toolGroup2D) {
					toolGroup2D =
						cornerstoneTools.ToolGroupManager.createToolGroup(toolGroup2DId)!;

					toolGroup2D.addTool(cornerstoneTools.WindowLevelTool.toolName);
					toolGroup2D.addTool(cornerstoneTools.ZoomTool.toolName);
					toolGroup2D.addTool(cornerstoneTools.PanTool.toolName);

					// Set active tools for 2D
					toolGroup2D.setToolActive(cornerstoneTools.WindowLevelTool.toolName, {
						bindings: [
							{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
						],
					});
					toolGroup2D.setToolActive(cornerstoneTools.ZoomTool.toolName, {
						bindings: [
							{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary },
						],
					});
					toolGroup2D.setToolActive(cornerstoneTools.PanTool.toolName, {
						bindings: [
							{ mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary },
						],
					});
				}

				// 3D Tool Group
				let toolGroup3D =
					cornerstoneTools.ToolGroupManager.getToolGroup(toolGroup3DId);
				if (!toolGroup3D) {
					toolGroup3D =
						cornerstoneTools.ToolGroupManager.createToolGroup(toolGroup3DId)!;

					toolGroup3D.addTool(cornerstoneTools.TrackballRotateTool.toolName);
					toolGroup3D.addTool(cornerstoneTools.ZoomTool.toolName);
					toolGroup3D.addTool(cornerstoneTools.PanTool.toolName);

					// Set active tools for 3D
					toolGroup3D.setToolActive(
						cornerstoneTools.TrackballRotateTool.toolName,
						{
							bindings: [
								{ mouseButton: cornerstoneTools.Enums.MouseBindings.Primary },
							],
						},
					);
					toolGroup3D.setToolActive(cornerstoneTools.ZoomTool.toolName, {
						bindings: [
							{ mouseButton: cornerstoneTools.Enums.MouseBindings.Secondary },
						],
					});
					toolGroup3D.setToolActive(cornerstoneTools.PanTool.toolName, {
						bindings: [
							{ mouseButton: cornerstoneTools.Enums.MouseBindings.Auxiliary },
						],
					});
				}

				// Add 2D viewports to 2D tool group
				["AXIAL", "SAGITTAL", "CORONAL"].forEach((viewportId) => {
					toolGroup2D!.addViewport(viewportId, engineId);
				});

				// Add 3D viewport to 3D tool group
				toolGroup3D.addViewport("VOLUME_3D", engineId);

				// Load NIFTI volume
				const token = localStorage.getItem("token");
				const imageUrl = `http://localhost:8000/api/scans/${scanId}/download/${modality}?token=${token}`;
				const volumeId = `nifti:${imageUrl}`;

				const imageIds = await createNiftiImageIdsAndCacheMetadata({
					url: imageUrl,
				});

				const volume = await cornerstone.volumeLoader.createAndCacheVolume(
					volumeId,
					{
						imageIds,
					},
				);

				await volume.load();

				// Set volume for all viewports
				await cornerstone.setVolumesForViewports(
					renderingEngine,
					[{ volumeId }],
					["AXIAL", "SAGITTAL", "CORONAL", "VOLUME_3D"],
				);

				// Configure 3D volume rendering
				const viewport3D = renderingEngine.getViewport("VOLUME_3D") as any;
				if (viewport3D && viewport3D.setProperties) {
					// Get the volume actor
					const volumeActor = viewport3D.getDefaultActor();
					if (volumeActor && volumeActor.actor) {
						const volumeActorEntry = volumeActor.actor;

						// Set up volume rendering properties
						const property = volumeActorEntry.getProperty();

						// Enable shading for better 3D appearance
						property.setShade(true);
						property.setAmbient(0.2);
						property.setDiffuse(0.7);
						property.setSpecular(0.3);
						property.setSpecularPower(8.0);

						// Set up opacity and color transfer functions for MRI
						const rgbTransferFunction = property.getRGBTransferFunction(0);
						const opacityTransferFunction = property.getScalarOpacity(0);

						// Clear existing points
						rgbTransferFunction.removeAllPoints();
						opacityTransferFunction.removeAllPoints();

						// MRI Brain preset - adjust these values based on your data
						// These are typical values for T1/T2/FLAIR MRI
						rgbTransferFunction.addRGBPoint(0, 0.0, 0.0, 0.0);
						rgbTransferFunction.addRGBPoint(100, 0.3, 0.3, 0.3);
						rgbTransferFunction.addRGBPoint(200, 0.6, 0.6, 0.6);
						rgbTransferFunction.addRGBPoint(500, 1.0, 1.0, 1.0);

						// Opacity transfer function - make lower values more transparent
						opacityTransferFunction.addPoint(0, 0.0);
						opacityTransferFunction.addPoint(50, 0.0);
						opacityTransferFunction.addPoint(100, 0.1);
						opacityTransferFunction.addPoint(200, 0.3);
						opacityTransferFunction.addPoint(500, 0.8);
						opacityTransferFunction.addPoint(1000, 1.0);

						// Set interpolation type
						property.setInterpolationTypeToLinear();
					}
				}

				renderingEngine.render();

				// Load and display segmentation if available
				try {
					const segUrl = `http://localhost:8000/api/scans/${scanId}/download/segmentation?token=${token}`;
					const segVolumeId = `cornerstoneStreamingImageVolume:seg_${scanId}`;

					console.log("Loading segmentation from:", segUrl);

					const segImageIds = await createNiftiImageIdsAndCacheMetadata({
						url: segUrl,
					});

					console.log("Segmentation image IDs created:", segImageIds.length);

					const segVolume = await cornerstone.volumeLoader.createAndCacheVolume(
						segVolumeId,
						{
							imageIds: segImageIds,
						},
					);

					await segVolume.load();
					console.log("Segmentation volume loaded");

					// Add segmentation to Cornerstone
					await cornerstoneTools.segmentation.addSegmentations([
						{
							segmentationId: segVolumeId,
							representation: {
								type: cornerstoneTools.Enums.SegmentationRepresentations
									.Labelmap,
								data: {
									volumeId: segVolumeId,
								},
							},
						},
					]);

					console.log("Segmentation added to state");

					// Add segmentation representations to 2D viewports via toolgroup
					const segRepresentationUID2D =
						await cornerstoneTools.segmentation.addSegmentationRepresentations(
							toolGroup2DId,
							[
								{
									segmentationId: segVolumeId,
									type: cornerstoneTools.Enums.SegmentationRepresentations
										.Labelmap,
								},
							],
						);

					// Add segmentation representation to 3D viewport via toolgroup
					const segRepresentationUID3D =
						await cornerstoneTools.segmentation.addSegmentationRepresentations(
							toolGroup3DId,
							[
								{
									segmentationId: segVolumeId,
									type: cornerstoneTools.Enums.SegmentationRepresentations
										.Labelmap,
								},
							],
						);

					console.log("Segmentation representations added:", {
						segRepresentationUID2D,
						segRepresentationUID3D,
					});

					renderingEngine.render();
					console.log("Segmentation loaded and rendered successfully");
				} catch (segErr) {
					console.error("Segmentation failed to load:", segErr);
					console.warn("Continuing without segmentation overlay");
				}

				setIsLoading(false);
			} catch (e) {
				console.error("Failed to load volumes", e);
				setIsLoading(false);
			}
		};

		loadVolumes();

		return () => {
			try {
				cornerstoneTools.ToolGroupManager.destroyToolGroup(`${toolGroupId}-2D`);
				cornerstoneTools.ToolGroupManager.destroyToolGroup(`${toolGroupId}-3D`);
			} catch (e) {
				console.warn("Cleanup error", e);
			}
		};
	}, [isReady, scanId, modality]);

	return (
		<div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 bg-black p-1 rounded-lg relative min-h-[600px]">
			{/* Axial View */}
			<div className="relative bg-black rounded overflow-hidden border border-border/50">
				<div
					ref={axialRef}
					className="w-full h-full absolute inset-0"
					style={{ zIndex: 1 }}
				/>
				<div
					className="absolute top-2 left-2 text-xs font-bold text-red-500 bg-black/80 px-2 py-1 rounded backdrop-blur-sm border border-red-500/30 pointer-events-none"
					style={{ zIndex: 999 }}
				>
					AXIAL
				</div>
			</div>

			{/* Sagittal View */}
			<div className="relative bg-black rounded overflow-hidden border border-border/50">
				<div
					ref={sagittalRef}
					className="w-full h-full absolute inset-0"
					style={{ zIndex: 1 }}
				/>
				<div
					className="absolute top-2 left-2 text-xs font-bold text-green-500 bg-black/80 px-2 py-1 rounded backdrop-blur-sm border border-green-500/30 pointer-events-none"
					style={{ zIndex: 999 }}
				>
					SAGITTAL
				</div>
			</div>

			{/* Coronal View */}
			<div className="relative bg-black rounded overflow-hidden border border-border/50">
				<div
					ref={coronalRef}
					className="w-full h-full absolute inset-0"
					style={{ zIndex: 1 }}
				/>
				<div
					className="absolute top-2 left-2 text-xs font-bold text-blue-500 bg-black/80 px-2 py-1 rounded backdrop-blur-sm border border-blue-500/30 pointer-events-none"
					style={{ zIndex: 999 }}
				>
					CORONAL
				</div>
			</div>

			{/* 3D Volume */}
			<div className="relative bg-black rounded overflow-hidden border border-border/50">
				<div
					ref={volume3DRef}
					className="w-full h-full absolute inset-0"
					style={{ zIndex: 1 }}
				/>
				<div
					className="absolute top-2 left-2 text-xs font-bold text-purple-500 bg-black/80 px-2 py-1 rounded backdrop-blur-sm border border-purple-500/30 pointer-events-none"
					style={{ zIndex: 999 }}
				>
					VOLUME 3D
				</div>
			</div>

			{/* Loading Overlay */}
			{(isLoading || !isReady) && (
				<div
					className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg"
					style={{ zIndex: 9999 }}
				>
					<div className="flex flex-col items-center gap-3">
						<div className="w-10 h-10 border-2 border-medical border-t-transparent rounded-full animate-spin" />
						<p className="text-sm text-medical font-mono tracking-wider">
							{!isReady ? "Initializing 3D Engine..." : "Loading Volume..."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};
