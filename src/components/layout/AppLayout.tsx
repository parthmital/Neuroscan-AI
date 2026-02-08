import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { useAuth } from "../auth/AuthContext";
import { LogOut, Settings, Bell, Search } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useConfig } from "@/hooks/use-config";

export const AppLayout = () => {
	const { data: config } = useConfig();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="min-h-screen bg-background">
			{/* Desktop sidebar */}
			<div className="hidden lg:block">
				<AppSidebar />
			</div>

			<div className="lg:pl-[260px]">
				{/* Top bar */}
				<header className="sticky top-0 z-30 h-14 sm:h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 sm:px-8">
					<div className="flex items-center gap-4 sm:gap-8 flex-1 mr-4 sm:mr-8">
						<MobileNav />
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder={config?.dashboard.searchPlaceholder || "Search..."}
								className="pl-9 h-9 bg-muted/50 border-none text-sm"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && searchQuery.trim()) {
										navigate(
											`/scans?search=${encodeURIComponent(searchQuery.trim())}`,
										);
									}
								}}
							/>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="h-8 w-[1px] bg-border hidden sm:block" />
						<div className="flex items-center gap-3 pl-1">
							<div className="hidden sm:flex flex-col items-end">
								<span className="text-sm font-medium leading-none">
									{user?.fullName}
								</span>
								<span className="text-[10px] text-muted-foreground uppercase tracking-tight">
									{user?.title || "Physician"}
								</span>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="w-9 h-9 rounded-full bg-medical/10 border border-medical/20 flex items-center justify-center text-medical font-bold hover:bg-medical/20 transition-all">
										{user?.fullName
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>My Account</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => navigate("/settings")}>
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={logout}
										className="text-destructive focus:text-destructive"
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</header>

				{/* Main content */}
				<main className="p-4 sm:p-6 lg:p-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
