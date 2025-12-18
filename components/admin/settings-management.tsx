"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, User, Lock, Globe, Key, Info } from "lucide-react";
import { useSession } from "next-auth/react";

type SettingsManagementProps = {
  user: {
    name?: string | null;
    email?: string | null;
  };
};

export function SettingsManagement({ user }: SettingsManagementProps) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully! Please logout and login again to see the changes in your session.");
      // Update local state to show the new name immediately
      setProfileData({ ...profileData, name: profileData.name });
      // Refresh to get updated data from DB
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Profile Settings */}
      <Card className="rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-base sm:text-lg">Profile Settings</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Update your account information and personal details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Your full name"
                required
                className="text-sm"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Your name is saved to the database. After updating, please logout and login again for the changes to reflect in your session.
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                disabled
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
                className="text-sm"
              />
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Email cannot be changed for security reasons.
              </p>
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto text-xs sm:text-sm">
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-base sm:text-lg">Change Password</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="currentPassword" className="text-xs sm:text-sm">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="newPassword" className="text-xs sm:text-sm">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password (min. 8 characters)"
                required
                minLength={8}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                required
                minLength={8}
                className="text-sm"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto text-xs sm:text-sm">
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle>System Information</CardTitle>
          </div>
          <CardDescription>
            View your system configuration and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Database</span>
              <span className="text-sm text-foreground">Connected</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Authentication</span>
              <span className="text-sm text-foreground">Active</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Session Status</span>
              <span className="text-sm text-foreground">Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Note: API keys and sensitive configuration are managed through environment variables for security. 
              Contact your system administrator for API configuration details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

