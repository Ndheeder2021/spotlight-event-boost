import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Mail, Crown, Edit3, Eye, Loader2, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { PlanType } from "@/hooks/usePlanFeatures";
import { showErrorToast } from "@/utils/errorMessages";

interface TeamMember {
  user_id: string;
  email: string;
  role: "owner" | "editor" | "viewer" | "admin" | "moderator" | "user";
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
  admin: Crown,
  moderator: Edit3,
  user: Eye,
};

const ROLE_LABELS = {
  owner: { sv: "Ägare", en: "Owner" },
  editor: { sv: "Redaktör", en: "Editor" },
  viewer: { sv: "Granskare", en: "Viewer" },
  admin: { sv: "Admin", en: "Admin" },
  moderator: { sv: "Moderator", en: "Moderator" },
  user: { sv: "Användare", en: "User" },
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
            role: role.role as "owner" | "editor" | "viewer" | "admin" | "moderator" | "user",
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
      toast.error(t('couldNotLoadTeamData'));
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!newEmail.trim()) {
      toast.error(t('enterEmailAddress'));
      return;
    }

    if (!canInvite) {
      toast.error(t('planMaxUsers', { maxUsers }));
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

      toast.success(t('invitationSentTo', { email: newEmail }));
      setNewEmail("");
      loadTeamData();
    } catch (error: any) {
      showErrorToast(toast, error, 'Kunde inte skicka inbjudan');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (userId === currentUserId) {
      toast.error(t('cannotRemoveYourself'));
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("tenant_id", tenantId);

      if (error) throw error;

      toast.success(t('userRemoved'));
      loadTeamData();
    } catch (error: any) {
      showErrorToast(toast, error, 'Kunde inte ta bort användare');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from("team_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) throw error;

      toast.success(t('invitationCancelled'));
      loadTeamData();
    } catch (error: any) {
      showErrorToast(toast, error, 'Kunde inte avbryta inbjudan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card">
          <Sparkles className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium">{t('loadingTeam')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20 premium-glow hover-lift animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary via-primary-glow to-primary/50 shadow-glow animate-pulse">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold gradient-text">
                {t('inviteTeamMembers')}
              </CardTitle>
              <CardDescription className="text-base flex items-center gap-2 mt-1">
                {t('youHaveUsersInTeam', { current: currentUserCount, max: maxUsers })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t('emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={!canInvite || inviting}
                className="h-11 glass-card border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">{t('role')}</Label>
              <Select
                value={newRole}
                onValueChange={(value: any) => setNewRole(value)}
                disabled={!canInvite || inviting}
              >
                <SelectTrigger className="h-11 glass-card border-border/50 hover:border-primary/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card">
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
            className="w-full h-11 hover-scale"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {inviting ? t('sending') : t('sendInvitation')}
          </Button>
          {!canInvite && (
            <div className="p-3 rounded-lg glass-card border-destructive/30 bg-destructive/5">
              <p className="text-sm text-destructive font-medium">
                {t('planLimitReached')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card border-accent/20 hover-lift animate-fade-in stagger-1">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent via-accent-glow to-accent/50 shadow-glow animate-pulse">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold gradient-text">{t('teamMembers')}</CardTitle>
              <CardDescription className="text-base mt-1">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  {t('memberCount', { count: members.length })}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-border/50 glass-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-accent/5">
                  <TableHead className="font-semibold">{t('teamEmail')}</TableHead>
                  <TableHead className="font-semibold">{t('role')}</TableHead>
                  <TableHead className="font-semibold">{t('addedOn')}</TableHead>
                  <TableHead className="text-right font-semibold">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => {
                  const RoleIcon = ROLE_ICONS[member.role] || Eye;
                  const roleLabel = ROLE_LABELS[member.role]?.[lang] || member.role;
                  return (
                    <TableRow key={member.user_id} className={`hover:bg-accent/5 transition-colors animate-fade-in stagger-${Math.min(index + 1, 5)}`}>
                      <TableCell className="font-medium">{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1.5 bg-primary/10 text-primary border-primary/20">
                          <RoleIcon className="h-3.5 w-3.5" />
                          {roleLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(member.created_at).toLocaleDateString("sv-SE")}
                      </TableCell>
                      <TableCell className="text-right">
                        {member.role !== "owner" && member.user_id !== currentUserId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
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
          </div>
        </CardContent>
      </Card>

      {invitations.length > 0 && (
        <Card className="glass-card border-warning/20 hover-lift animate-fade-in stagger-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-warning via-warning/80 to-warning/50 shadow-glow animate-pulse">
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold gradient-text">{t('pendingInvitations')}</CardTitle>
                <CardDescription className="text-base mt-1">
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                    {t('invitationCount', { count: invitations.length })}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border border-border/50 glass-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-accent/5">
                    <TableHead className="font-semibold">{t('teamEmail')}</TableHead>
                    <TableHead className="font-semibold">{t('role')}</TableHead>
                    <TableHead className="font-semibold">{t('expires')}</TableHead>
                    <TableHead className="text-right font-semibold">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invite, index) => {
                    const role = invite.role as "owner" | "editor" | "viewer" | "admin" | "moderator" | "user";
                    const RoleIcon = ROLE_ICONS[role] || Edit3;
                    const roleLabel = ROLE_LABELS[role] || { sv: invite.role, en: invite.role };
                    return (
                      <TableRow key={invite.id} className={`hover:bg-accent/5 transition-colors animate-fade-in stagger-${Math.min(index + 1, 5)}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {invite.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1.5 bg-warning/10 text-warning border-warning/20">
                            <RoleIcon className="h-3.5 w-3.5" />
                            {roleLabel[lang]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(invite.expires_at).toLocaleDateString("sv-SE")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelInvitation(invite.id)}
                            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card border-accent/30 bg-accent/5 hover-lift animate-fade-in stagger-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <CardTitle className="text-base font-semibold gradient-text">{t('roleDescriptions')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex gap-3 p-3 rounded-lg glass-card border-border/50 hover:border-primary/30 transition-colors">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 h-fit">
              <Crown className="h-4 w-4 text-primary flex-shrink-0" />
            </div>
            <div>
              <strong className="text-foreground">{t('ownerRole')}:</strong> <span className="text-muted-foreground">{t('ownerRoleDesc')}</span>
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-lg glass-card border-border/50 hover:border-accent/30 transition-colors">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 h-fit">
              <Edit3 className="h-4 w-4 text-accent flex-shrink-0" />
            </div>
            <div>
              <strong className="text-foreground">{t('editorRole')}:</strong> <span className="text-muted-foreground">{t('editorRoleDesc')}</span>
            </div>
          </div>
          <div className="flex gap-3 p-3 rounded-lg glass-card border-border/50 hover:border-muted/30 transition-colors">
            <div className="p-2 rounded-lg bg-gradient-to-br from-muted/20 to-muted/10 h-fit">
              <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
            <div>
              <strong className="text-foreground">{t('viewerRole')}:</strong> <span className="text-muted-foreground">{t('viewerRoleDesc')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
