import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Mail, Crown, Edit3, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { PlanType } from "@/hooks/usePlanFeatures";

interface TeamMember {
  user_id: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  created_at: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  created_at: string;
}

interface TeamManagementProps {
  currentPlan: PlanType;
  tenantId: string;
}

const PLAN_LIMITS = {
  starter: 1,
  professional: 3,
  enterprise: 10,
};

const ROLE_ICONS = {
  owner: Crown,
  editor: Edit3,
  viewer: Eye,
};

const ROLE_LABELS = {
  owner: { sv: "Ägare", en: "Owner" },
  editor: { sv: "Redaktör", en: "Editor" },
  viewer: { sv: "Granskare", en: "Viewer" },
};

export function TeamManagement({ currentPlan, tenantId }: TeamManagementProps) {
  const { t, i18n } = useTranslation();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"editor" | "viewer">("editor");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const maxUsers = PLAN_LIMITS[currentPlan];
  const currentUserCount = members.length;
  const canInvite = currentUserCount < maxUsers;
  const lang = i18n.language as "sv" | "en";

  useEffect(() => {
    loadTeamData();
  }, [tenantId]);

  const loadTeamData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // Load team members
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at")
        .eq("tenant_id", tenantId);

      if (roles) {
        // Get user emails
        const { data: listData } = await supabase.auth.admin.listUsers();
        const allUsers = listData?.users || [];
        
        const membersWithEmails = roles.map((role) => {
          const authUser = allUsers.find((u: any) => u.id === role.user_id);
          return {
            user_id: role.user_id,
            email: authUser?.email || "Unknown",
            role: role.role as "owner" | "editor" | "viewer",
            created_at: role.created_at,
          };
        });
        
        setMembers(membersWithEmails);
      }

      // Load pending invitations
      const { data: invites } = await supabase
        .from("team_invitations")
        .select("*")
        .eq("tenant_id", tenantId)
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString())
        .in("role", ["owner", "editor", "viewer"]);

      if (invites) {
        setInvitations(invites as Invitation[]);
      }
    } catch (error: any) {
      console.error("Error loading team:", error);
      toast.error("Kunde inte ladda team-data");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!newEmail.trim()) {
      toast.error("Ange en e-postadress");
      return;
    }

    if (!canInvite) {
      toast.error(`Din plan tillåter max ${maxUsers} användare`);
      return;
    }

    setInviting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const token = crypto.randomUUID();

      const { error } = await supabase
        .from("team_invitations")
        .insert({
          tenant_id: tenantId,
          email: newEmail.toLowerCase().trim(),
          role: newRole,
          invited_by: user.id,
          token,
        });

      if (error) throw error;

      toast.success(`Inbjudan skickad till ${newEmail}`);
      setNewEmail("");
      loadTeamData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (userId === currentUserId) {
      toast.error("Du kan inte ta bort dig själv");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("tenant_id", tenantId);

      if (error) throw error;

      toast.success("Användare borttagen");
      loadTeamData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from("team_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) throw error;

      toast.success("Inbjudan avbruten");
      loadTeamData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bjud in teammedlemmar</CardTitle>
          <CardDescription>
            Du har {currentUserCount} av {maxUsers} användare i ditt team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="email">E-postadress</Label>
              <Input
                id="email"
                type="email"
                placeholder="kollega@företag.se"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={!canInvite || inviting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Roll</Label>
              <Select
                value={newRole}
                onValueChange={(value: any) => setNewRole(value)}
                disabled={!canInvite || inviting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      {ROLE_LABELS.editor[lang]}
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {ROLE_LABELS.viewer[lang]}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleInvite}
            disabled={!canInvite || inviting}
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {inviting ? "Skickar..." : "Skicka inbjudan"}
          </Button>
          {!canInvite && (
            <p className="text-sm text-destructive">
              Du har nått maxgränsen för din plan. Uppgradera för fler användare.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teammedlemmar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-post</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Tillagd</TableHead>
                <TableHead className="text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const RoleIcon = ROLE_ICONS[member.role];
                return (
                  <TableRow key={member.user_id}>
                    <TableCell className="font-medium">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {ROLE_LABELS[member.role][lang]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString("sv-SE")}
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role !== "owner" && member.user_id !== currentUserId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.user_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Väntande inbjudningar</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-post</TableHead>
                  <TableHead>Roll</TableHead>
                  <TableHead>Utgår</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invite) => {
                  const role = invite.role as "owner" | "editor" | "viewer";
                  const RoleIcon = ROLE_ICONS[role] || Edit3;
                  const roleLabel = ROLE_LABELS[role] || ROLE_LABELS.editor;
                  return (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {invite.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleLabel[lang]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(invite.expires_at).toLocaleDateString("sv-SE")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvitation(invite.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Rollbeskrivningar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <Crown className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <strong>Ägare:</strong> Full tillgång till allt inklusive fakturering, inställningar, analytics och team-hantering
            </div>
          </div>
          <div className="flex gap-3">
            <Edit3 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <strong>Redaktör:</strong> Kan skapa, redigera och ta bort kampanjer, generera PDF/mockups och dela
            </div>
          </div>
          <div className="flex gap-3">
            <Eye className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <strong>Granskare:</strong> Kan endast visa kampanjer och lämna kommentarer
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
