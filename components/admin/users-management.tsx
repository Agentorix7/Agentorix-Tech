"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  TriangleAlert,
  Pencil,
} from "lucide-react";
import { AdminModal } from "@/components/admin/admin-modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FileUploadField } from "@/components/admin/file-upload-field";
import { toast } from "sonner";

type UserSummary = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
};

type TeamMemberSummary = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  bio?: string;
  image?: string;
  linkedinUrl?: string | null;
};

async function jsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  try {
    // Some endpoints (e.g. DELETE 204) may return no JSON body
    return (await res.json()) as T;
  } catch {
    return undefined as T;
  }
}

export function UsersManagement({
  initialUsers,
  initialTeamMembers,
}: {
  initialUsers: UserSummary[];
  initialTeamMembers: TeamMemberSummary[];
}) {
  const [users, setUsers] = useState<UserSummary[]>(initialUsers);
  const [team, setTeam] = useState<TeamMemberSummary[]>(initialTeamMembers);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [teamForm, setTeamForm] = useState<{
    name: string;
    role: string;
    department: string;
    email: string;
    bio: string;
    image: string;
    linkedinUrl: string;
  }>({
    name: "",
    role: "",
    department: "",
    email: "",
    bio: "",
    image: "",
    linkedinUrl: "",
  });
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);
  const [confirmTeamId, setConfirmTeamId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [teamQuery, setTeamQuery] = useState("");
  const [viewUser, setViewUser] = useState<UserSummary | null>(null);
  const [viewTeam, setViewTeam] = useState<TeamMemberSummary | null>(null);
  const [editUser, setEditUser] = useState<UserSummary | null>(null);
  const [editTeam, setEditTeam] = useState<TeamMemberSummary | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingUser(true);
    try {
      const created = await jsonFetch<UserSummary>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(userForm),
      });
      setUsers((prev) => [created, ...prev]);
      setUserForm({ name: "", email: "", password: "", isAdmin: false });
      setShowUserModal(false);
      toast.success("User created");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const previous = users;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await jsonFetch(`/api/admin/users/${id}`, { method: "DELETE" });
      toast.success("User deleted");
    } catch (err) {
      console.error(err);
      setUsers(previous);
      toast.error("Failed to delete user");
    }
  };

  const handleToggleAdmin = async (user: UserSummary) => {
    const previous = users;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u
      )
    );
    try {
      const updated = await jsonFetch<UserSummary>(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isAdmin: !user.isAdmin }),
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(
        updated.isAdmin ? "User promoted to admin" : "Admin access revoked"
      );
    } catch (err) {
      console.error(err);
      setUsers(previous);
      toast.error("Failed to update user role");
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.image) {
      toast.error("Please upload a profile image");
      return;
    }
    setLoadingTeam(true);
    try {
      const created = await jsonFetch<TeamMemberSummary>(
        "/api/admin/team-members",
        {
          method: "POST",
          body: JSON.stringify(teamForm),
        }
      );
      setTeam((prev) => [created, ...prev]);
      setTeamForm({
        name: "",
        role: "",
        department: "",
        email: "",
        bio: "",
        image: "",
        linkedinUrl: "",
      });
      setShowTeamModal(false);
      toast.success("Team member added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add team member");
    } finally {
      setLoadingTeam(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    const previous = team;
    setTeam((prev) => prev.filter((m) => m.id !== id));
    try {
      await jsonFetch(`/api/admin/team-members/${id}`, { method: "DELETE" });
      toast.success("Team member deleted");
    } catch (err) {
      console.error(err);
      setTeam(previous);
      toast.error("Failed to delete team member");
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredTeam = team.filter((m) =>
    `${m.name} ${m.role} ${m.department} ${m.email}`
      .toLowerCase()
      .includes(teamQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3">
        <Button size="sm" variant="outline" onClick={() => setShowUserModal(true)} className="w-full sm:w-auto">
          <span className="text-xs sm:text-sm">Add admin user</span>
        </Button>
        <Button size="sm" onClick={() => setShowTeamModal(true)} className="w-full sm:w-auto">
          <span className="text-xs sm:text-sm">Add team member</span>
        </Button>
      </div>

      {/* Spacer row to align with overall layout; forms are now in modals */}

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-lg sm:rounded-2xl shadow-sm border-border/60">
          <CardHeader className="pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm sm:text-base">
              Users with dashboard access
            </CardTitle>
            <Input
              placeholder="Search users..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="h-8 w-full sm:max-w-xs text-xs"
            />
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredUsers.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No users created yet.
              </p>
            )}
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onClick={() => setViewUser(user)}
                onToggleAdmin={() => handleToggleAdmin(user)}
                onDelete={() => setConfirmUserId(user.id)}
                onEdit={() => setEditUser(user)}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg sm:rounded-2xl shadow-sm border-border/60">
          <CardHeader className="pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm sm:text-base">
              Team members (public site)
            </CardTitle>
            <Input
              placeholder="Search team..."
              value={teamQuery}
              onChange={(e) => setTeamQuery(e.target.value)}
              className="h-8 w-full sm:max-w-xs text-xs"
            />
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredTeam.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No team members added yet.
              </p>
            )}
            {filteredTeam.map((member) => (
              <TeamRow
                key={member.id}
                member={member}
                onClick={() => setViewTeam(member)}
                onDelete={() => setConfirmTeamId(member.id)}
                onEdit={() => setEditTeam(member)}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <AdminModal
        open={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Add admin / CMS user"
        description="Create a user who can log into the admin dashboard."
        icon={<Users className="h-4 w-4" />}
      >
        <form onSubmit={handleCreateUser} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="user-name">Name</Label>
                  <Input
                    id="user-name"
                    required
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Admin user name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="Strong password"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs md:text-sm">
                    <input
                      type="checkbox"
                      checked={userForm.isAdmin}
                      onChange={(e) =>
                        setUserForm((f) => ({
                          ...f,
                          isAdmin: e.target.checked,
                        }))
                      }
                      className="h-3 w-3 rounded border-border"
                    />
                    <span>Grant full admin access</span>
                  </label>
                  <Button type="submit" size="sm" disabled={loadingUser}>
                    {loadingUser ? "Creating..." : "Create user"}
                  </Button>
                </div>
              </form>
      </AdminModal>

      <AdminModal
        open={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title="Add team member"
        description="Manage the public-facing team members on the website."
        icon={<UserPlus className="h-4 w-4" />}
      >
        <form onSubmit={handleCreateTeam} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="team-name">Name</Label>
                  <Input
                    id="team-name"
                    required
                    value={teamForm.name}
                    onChange={(e) =>
                      setTeamForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Team member name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-role">Role</Label>
                  <Input
                    id="team-role"
                    required
                    value={teamForm.role}
                    onChange={(e) =>
                      setTeamForm((f) => ({ ...f, role: e.target.value }))
                    }
                    placeholder="CTO, Marketing Lead..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-dept">Department</Label>
                  <Input
                    id="team-dept"
                    required
                    value={teamForm.department}
                    onChange={(e) =>
                      setTeamForm((f) => ({
                        ...f,
                        department: e.target.value,
                      }))
                    }
                    placeholder="AI, Marketing, Engineering..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-email">Email</Label>
                  <Input
                    id="team-email"
                    type="email"
                    required
                    value={teamForm.email}
                    onChange={(e) =>
                      setTeamForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="member@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team-bio">Short bio</Label>
                  <Textarea
                    id="team-bio"
                    value={teamForm.bio}
                    onChange={(e) =>
                      setTeamForm((f) => ({ ...f, bio: e.target.value }))
                    }
                    placeholder="Brief introduction that will appear on the site"
                    className="min-h-[80px]"
                  />
                </div>
                <FileUploadField
                  label="Profile image"
                  description=""
                  value={teamForm.image}
                  onChange={(url) =>
                    setTeamForm((f) => ({ ...f, image: url }))
                  }
                  uploadUrl="/api/admin/uploads/team-member"
                  onUploadingChange={setUploadingImage}
                />
                <div className="space-y-1.5">
                  <Label htmlFor="team-linkedin">LinkedIn URL</Label>
                  <Input
                    id="team-linkedin"
                    value={teamForm.linkedinUrl}
                    onChange={(e) =>
                      setTeamForm((f) => ({
                        ...f,
                        linkedinUrl: e.target.value,
                      }))
                    }
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loadingTeam || uploadingImage}
                  >
                    {loadingTeam ? "Saving..." : "Save member"}
                  </Button>
                </div>
              </form>
      </AdminModal>

      {/* View user details */}
      <AdminModal
        open={!!viewUser}
        onClose={() => setViewUser(null)}
        title={viewUser?.name || "User details"}
        description={viewUser?.email}
        icon={<Users className="h-4 w-4" />}
      >
        {viewUser && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email:</span> {viewUser.email}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              {viewUser.isAdmin ? "Admin" : "Standard"}
            </p>
            <p>
              <span className="font-medium">Created:</span>{" "}
              {new Date(viewUser.createdAt).toLocaleString()}
            </p>
            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditUser(viewUser);
                  setViewUser(null);
                }}
              >
                Edit user
              </Button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* View team member details */}
      <AdminModal
        open={!!viewTeam}
        onClose={() => setViewTeam(null)}
        title={viewTeam?.name || "Team member"}
        description={viewTeam?.email}
        icon={<UserPlus className="h-4 w-4" />}
        imageSrc={viewTeam?.image}
      >
        {viewTeam && (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Role:</span> {viewTeam.role}
            </p>
            <p>
              <span className="font-medium">Department:</span>{" "}
              {viewTeam.department}
            </p>
            {viewTeam.bio && (
              <p>
                <span className="font-medium">Bio:</span> {viewTeam.bio}
              </p>
            )}
            {viewTeam.linkedinUrl && (
              <p>
                <span className="font-medium">LinkedIn:</span>{" "}
                {viewTeam.linkedinUrl}
              </p>
            )}
            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditTeam(viewTeam);
                  setViewTeam(null);
                }}
              >
                Edit member
              </Button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit user */}
      <AdminModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit user"
        icon={<Users className="h-4 w-4" />}
      >
        {editUser && (
          <UserEditForm
            initial={editUser}
            onCancel={() => setEditUser(null)}
            onSave={async (data) => {
              try {
                const updated = await jsonFetch<UserSummary>(
                  `/api/admin/users/${editUser.id}`,
                  {
                    method: "PATCH",
                    body: JSON.stringify(data),
                  }
                );
                setUsers((prev) =>
                  prev.map((u) => (u.id === updated.id ? updated : u))
                );
                toast.success("User updated");
                setEditUser(null);
              } catch (err) {
                console.error(err);
                toast.error("Failed to update user");
              }
            }}
          />
        )}
      </AdminModal>

      {/* Edit team member */}
      <AdminModal
        open={!!editTeam}
        onClose={() => setEditTeam(null)}
        title="Edit team member"
        icon={<UserPlus className="h-4 w-4" />}
        imageSrc={editTeam?.image}
      >
        {editTeam && (
          <TeamEditForm
            initial={editTeam}
            onCancel={() => setEditTeam(null)}
            onSave={async (data) => {
              try {
                const updated = await jsonFetch<TeamMemberSummary>(
                  `/api/admin/team-members/${editTeam.id}`,
                  {
                    method: "PATCH",
                    body: JSON.stringify(data),
                  }
                );
                setTeam((prev) =>
                  prev.map((m) => (m.id === updated.id ? updated : m))
                );
                toast.success("Team member updated");
                setEditTeam(null);
              } catch (err) {
                console.error(err);
                toast.error("Failed to update team member");
              }
            }}
          />
        )}
      </AdminModal>

      <ConfirmDialog
        open={Boolean(confirmUserId)}
        onCancel={() => setConfirmUserId(null)}
        onConfirm={() => {
          if (confirmUserId) {
            const id = confirmUserId;
            setConfirmUserId(null);
            void handleDeleteUser(id);
          }
        }}
        title="Delete user?"
        description="This will remove access for this user. This action cannot be undone."
        icon={<TriangleAlert className="h-4 w-4" />}
        confirmLabel="Delete user"
      />

      <ConfirmDialog
        open={Boolean(confirmTeamId)}
        onCancel={() => setConfirmTeamId(null)}
        onConfirm={() => {
          if (confirmTeamId) {
            const id = confirmTeamId;
            setConfirmTeamId(null);
            void handleDeleteTeamMember(id);
          }
        }}
        title="Delete team member?"
        description="This member will be removed from the public website."
        icon={<TriangleAlert className="h-4 w-4" />}
        confirmLabel="Delete member"
      />
    </div>
  );
}

function UserRow({
  user,
  onClick,
  onToggleAdmin,
  onDelete,
  onEdit,
}: {
  user: UserSummary;
  onClick: () => void;
  onToggleAdmin: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5"
    >
      <div
        className="flex items-center gap-3 min-w-0 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {user.name?.charAt(0).toUpperCase() ||
            user.email.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-medium truncate">
            {user.name || user.email}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user.isAdmin && (
          <Badge
            variant="outline"
            className="border-emerald-500/60 text-emerald-500 bg-emerald-500/5 text-[10px] inline-flex items-center gap-1"
          >
            <ShieldCheck className="h-3 w-3" />
            Admin
          </Badge>
        )}
        {/* <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          title={user.isAdmin ? "Revoke admin" : "Promote to admin"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleAdmin();
          }}
        >
          <ShieldCheck
            className={`h-3.5 w-3.5 ${
              user.isAdmin ? "text-emerald-500" : ""
            }`}
          />
        </Button> */}
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          title="Edit user"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete user"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function TeamRow({
  member,
  onClick,
  onDelete,
  onEdit,
}: {
  member: TeamMemberSummary;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5"
    >
      <div
        className="flex items-center gap-3 min-w-0 cursor-pointer"
        onClick={onClick}
      >
        {member.image ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.image}
              alt={member.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-medium truncate">{member.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {member.role} · {member.department}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          title="Edit team member"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete team member"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function UserEditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: UserSummary;
  onSave: (data: { name: string; email: string; isAdmin: boolean }) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial.name,
    email: initial.email,
    isAdmin: initial.isAdmin,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="User name"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="user@example.com"
        />
      </div>
      <div className="flex items-center justify-between gap-3 pt-1">
        <label className="flex items-center gap-2 text-xs md:text-sm">
          <input
            type="checkbox"
            checked={form.isAdmin}
            onChange={(e) =>
              setForm((f) => ({ ...f, isAdmin: e.target.checked }))
            }
            className="h-3 w-3 rounded border-border"
          />
          <span>Grant full admin access</span>
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function TeamEditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: TeamMemberSummary;
  onSave: (
    data: {
      name: string;
      role: string;
      department: string;
      email: string;
      bio?: string;
      image?: string;
      linkedinUrl?: string | null;
    }
  ) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial.name,
    role: initial.role,
    department: initial.department,
    email: initial.email,
    bio: initial.bio || "",
    image: initial.image || "",
    linkedinUrl: initial.linkedinUrl || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Team member name"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Role</Label>
        <Input
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          placeholder="CTO, Marketing Lead..."
        />
      </div>
      <div className="space-y-1.5">
        <Label>Department</Label>
        <Input
          value={form.department}
          onChange={(e) =>
            setForm((f) => ({ ...f, department: e.target.value }))
          }
          placeholder="AI, Marketing, Engineering..."
        />
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="member@example.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Short bio</Label>
        <Textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          className="min-h-[80px]"
        />
      </div>
      <FileUploadField
        label="Profile image"
        description=""
        value={form.image}
        onChange={(url) => setForm((f) => ({ ...f, image: url }))}
        uploadUrl="/api/admin/uploads/team-member"
      />
      <div className="space-y-1.5">
        <Label>LinkedIn URL</Label>
        <Input
          value={form.linkedinUrl || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, linkedinUrl: e.target.value }))
          }
          placeholder="https://linkedin.com/in/username"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}