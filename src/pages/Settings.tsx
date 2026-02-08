import { useState } from "react";
import { User, Bell, Palette, Shield, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useConfig } from "@/hooks/use-config";
import { useAuth } from "@/components/auth/AuthContext";

const Settings = () => {
	const { data: config, isLoading: configLoading } = useConfig();
	const { user } = useAuth();
	const [darkMode, setDarkMode] = useState(false);
	const [notifications, setNotifications] = useState({
		scanComplete: true,
		scanFailed: true,
		weeklyReport: false,
		systemUpdates: true,
	});

	if (configLoading || !config || !user) {
		return (
			<div className="space-y-6 max-w-3xl animate-pulse">
				<div className="h-20 bg-muted rounded-xl w-1/3" />
				<div className="h-64 bg-muted rounded-xl" />
			</div>
		);
	}

	const toggleDarkMode = (enabled: boolean) => {
		setDarkMode(enabled);
		document.documentElement.classList.toggle("dark", enabled);
	};

	return (
		<div className="space-y-6 max-w-3xl">
			<div>
				<h1 className="text-2xl font-bold text-foreground tracking-tight">
					Settings
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Manage your account, preferences, and application settings.
				</p>
			</div>

			<Tabs defaultValue="profile" className="space-y-6">
				<TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
					<TabsTrigger value="profile" className="gap-1.5 text-xs">
						<User className="w-3.5 h-3.5" />
						<span className="hidden sm:inline">Profile</span>
					</TabsTrigger>
					<TabsTrigger value="appearance" className="gap-1.5 text-xs">
						<Palette className="w-3.5 h-3.5" />
						<span className="hidden sm:inline">Appearance</span>
					</TabsTrigger>
					<TabsTrigger value="notifications" className="gap-1.5 text-xs">
						<Bell className="w-3.5 h-3.5" />
						<span className="hidden sm:inline">Notifications</span>
					</TabsTrigger>
					<TabsTrigger value="security" className="gap-1.5 text-xs">
						<Shield className="w-3.5 h-3.5" />
						<span className="hidden sm:inline">Security</span>
					</TabsTrigger>
				</TabsList>

				{/* Profile */}
				<TabsContent value="profile">
					<div className="bg-card rounded-xl border border-border p-5 sm:p-6 space-y-6">
						<div>
							<h2 className="text-sm font-semibold text-foreground mb-4">
								Profile Information
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label className="text-xs font-medium text-muted-foreground">
										First Name
									</label>
									<Input
										defaultValue={user.fullName.split(" ")[0]}
										className="h-9 text-sm"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-muted-foreground">
										Last Name
									</label>
									<Input
										defaultValue={user.fullName.split(" ").slice(1).join(" ")}
										className="h-9 text-sm"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-muted-foreground">
										Email
									</label>
									<Input defaultValue={user.email} className="h-9 text-sm" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-muted-foreground">
										Department
									</label>
									<Input
										defaultValue={user.department}
										className="h-9 text-sm"
									/>
								</div>
								<div className="space-y-2 sm:col-span-2">
									<label className="text-xs font-medium text-muted-foreground">
										Institution
									</label>
									<Input
										defaultValue={user.institution}
										className="h-9 text-sm"
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-end pt-2 border-t border-border">
							<Button className="bg-medical text-medical-foreground hover:bg-medical/90 text-xs gap-1.5">
								Save Changes
							</Button>
						</div>
					</div>
				</TabsContent>

				{/* Appearance */}
				<TabsContent value="appearance">
					<div className="bg-card rounded-xl border border-border p-5 sm:p-6 space-y-6">
						<div>
							<h2 className="text-sm font-semibold text-foreground mb-1">
								Theme
							</h2>
							<p className="text-xs text-muted-foreground mb-4">
								Customise the application appearance.
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<button
									onClick={() => toggleDarkMode(false)}
									className={cn(
										"flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
										!darkMode
											? "border-medical bg-medical/5"
											: "border-border hover:border-muted-foreground/30",
									)}
								>
									<Sun className="w-5 h-5 text-warning" />
									<div className="text-left">
										<p className="text-sm font-medium text-foreground">Light</p>
										<p className="text-xs text-muted-foreground">
											Clean and bright interface
										</p>
									</div>
								</button>
								<button
									onClick={() => toggleDarkMode(true)}
									className={cn(
										"flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
										darkMode
											? "border-medical bg-medical/5"
											: "border-border hover:border-muted-foreground/30",
									)}
								>
									<Moon className="w-5 h-5 text-info" />
									<div className="text-left">
										<p className="text-sm font-medium text-foreground">Dark</p>
										<p className="text-xs text-muted-foreground">
											Optimised for low-light reading
										</p>
									</div>
								</button>
							</div>
						</div>

						<div>
							<h2 className="text-sm font-semibold text-foreground mb-1">
								Overlay Defaults
							</h2>
							<p className="text-xs text-muted-foreground mb-4">
								Set default segmentation overlay colours.
							</p>
							<div className="space-y-3">
								{[
									{ label: "Whole Tumour (WT)", color: "hsl(50, 100%, 50%)" },
									{ label: "Tumour Core (TC)", color: "hsl(0, 100%, 50%)" },
									{
										label: "Enhancing Tumour (ET)",
										color: "hsl(220, 100%, 60%)",
									},
								].map((item) => (
									<div
										key={item.label}
										className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border"
									>
										<div
											className="w-4 h-4 rounded-sm shrink-0"
											style={{ backgroundColor: item.color }}
										/>
										<span className="text-sm text-foreground flex-1">
											{item.label}
										</span>
										<Input
											defaultValue={item.color}
											className="h-7 w-40 text-xs font-mono hidden sm:block"
											readOnly
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Notifications */}
				<TabsContent value="notifications">
					<div className="bg-card rounded-xl border border-border p-5 sm:p-6 space-y-6">
						<div>
							<h2 className="text-sm font-semibold text-foreground mb-1">
								Email Notifications
							</h2>
							<p className="text-xs text-muted-foreground mb-4">
								Configure when you receive email alerts.
							</p>
							<div className="space-y-3">
								{[
									{
										key: "scanComplete",
										label: "Scan Processing Complete",
										description: "Notify when a scan finishes AI analysis",
									},
									{
										key: "scanFailed",
										label: "Scan Processing Failed",
										description: "Alert when a scan fails during processing",
									},
									{
										key: "weeklyReport",
										label: "Weekly Summary Report",
										description: "Receive a weekly digest of scan activity",
									},
									{
										key: "systemUpdates",
										label: "System Updates",
										description:
											"Notifications about platform updates and maintenance",
									},
								].map((item) => (
									<div
										key={item.key}
										className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border"
									>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground">
												{item.label}
											</p>
											<p className="text-xs text-muted-foreground">
												{item.description}
											</p>
										</div>
										<Switch
											checked={
												notifications[item.key as keyof typeof notifications]
											}
											onCheckedChange={(checked) =>
												setNotifications((prev) => ({
													...prev,
													[item.key]: checked,
												}))
											}
											className="shrink-0"
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Security */}
				<TabsContent value="security">
					<div className="bg-card rounded-xl border border-border p-5 sm:p-6 space-y-6">
						<div>
							<h2 className="text-sm font-semibold text-foreground mb-1">
								Change Password
							</h2>
							<p className="text-xs text-muted-foreground mb-4">
								Update your account password.
							</p>
							<div className="space-y-3 max-w-sm">
								<div className="space-y-2">
									<label className="text-xs font-medium text-muted-foreground">
										Current Password
									</label>
									<Input type="password" className="h-9 text-sm" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-muted-foreground">
										New Password
									</label>
									<Input type="password" className="h-9 text-sm" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-muted-foreground">
										Confirm New Password
									</label>
									<Input type="password" className="h-9 text-sm" />
								</div>
							</div>
						</div>

						<div>
							<h2 className="text-sm font-semibold text-foreground mb-1">
								Two-Factor Authentication
							</h2>
							<p className="text-xs text-muted-foreground mb-4">
								Add an extra layer of security to your account.
							</p>
							<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
								<Shield className="w-5 h-5 text-medical shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-foreground">
										Enable 2FA
									</p>
									<p className="text-xs text-muted-foreground">
										Secure your account with TOTP authentication
									</p>
								</div>
								<Switch className="shrink-0" />
							</div>
						</div>

						<div className="flex justify-end pt-2 border-t border-border">
							<Button className="bg-medical text-medical-foreground hover:bg-medical/90 text-xs gap-1.5">
								Update Security
							</Button>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Settings;
