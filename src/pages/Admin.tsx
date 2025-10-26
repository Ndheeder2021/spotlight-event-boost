import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, MessageSquare, Building2, BarChart, Eye, Trash2, Gift, UserCheck, Sparkles, Shield, Search, Download } from "lucide-react";
import { toast } from "sonner";

interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  tenant_id: string;
  created_at: string;
}

interface DetailedUser {
  user_id: string;
  email: string;
  role: string;
  tenant_id: string;
  tenant_name: string;
  created_at: string;
}

interface Referral {
  id: string;
  email: string;
  referral_code: string;
  referred_count: number;
  total_commission: number;
  commission_rate: number;
  created_at: string;
}

interface Affiliate {
  id: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
  description: string;
  audience: string;
  status: string;
  commission_rate: number;
  total_commission: number;
  referred_count: number;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [showTenantsDialog, setShowTenantsDialog] = useState(false);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [showPayingDialog, setShowPayingDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedUser, setSelectedUser] = useState<DetailedUser | null>(null);
  const [detailedUsers, setDetailedUsers] = useState<DetailedUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  
  // Lead Finder state
  const [leadFinderCities, setLeadFinderCities] = useState("Stockholm, Gothenburg, Malmö, Uppsala, Västerås, Copenhagen, Oslo");
  const [leadFinderBusinessTypes, setLeadFinderBusinessTypes] = useState("hotel, restaurant, cafeteria, bar");
  const [leadFinderMaxResults, setLeadFinderMaxResults] = useState(150);
  const [leadFinderRunning, setLeadFinderRunning] = useState(false);
  const [leadFinderJobId, setLeadFinderJobId] = useState<string | null>(null);
  const [leadFinderProgress, setLeadFinderProgress] = useState(0);
  const [leadFinderStatus, setLeadFinderStatus] = useState<string>("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Du måste vara inloggad");
        navigate("/");
        return;
      }

      // Check if user is admin
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (rolesError) throw rolesError;

      if (!roles || roles.length === 0) {
        toast.error("Du har inte admin-behörighet");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await loadAdminData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast.error("Ett fel uppstod");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      // Load tenants
      const { data: tenantsData, error: tenantsError } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false });

      if (tenantsError) throw tenantsError;
      setTenants(tenantsData || []);

      // Load contact messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (messagesError) throw messagesError;
      setContactMessages(messagesData || []);

      // Load user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (rolesError) throw rolesError;
      setUserRoles(rolesData || []);

      // Load detailed user information
      await loadDetailedUsers(rolesData || []);

      // Load referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from("referrals")
        .select("*")
        .order("created_at", { ascending: false });

      if (referralsError) throw referralsError;
      setReferrals(referralsData || []);

      // Load affiliates
      const { data: affiliatesData, error: affiliatesError } = await supabase
        .from("affiliates")
        .select("*")
        .order("created_at", { ascending: false });

      if (affiliatesError) throw affiliatesError;
      setAffiliates(affiliatesData || []);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Kunde inte ladda admin-data");
    }
  };

  const loadDetailedUsers = async (roles: UserRole[]) => {
    try {
      const response = await supabase.auth.admin.listUsers();
      if (response.error) throw response.error;

      const users = response.data.users || [];
      const detailed = roles.map(role => {
        const user = users.find((u: any) => u.id === role.user_id);
        const tenant = tenants.find(t => t.id === role.tenant_id);
        return {
          user_id: role.user_id,
          email: user?.email || "Okänd",
          role: role.role,
          tenant_id: role.tenant_id,
          tenant_name: tenant?.name || "Okänd",
          created_at: role.created_at,
        };
      });

      setDetailedUsers(detailed);
    } catch (error) {
      console.error("Error loading detailed users:", error);
    }
  };

  const deleteTenant = async (tenantId: string) => {
    if (!confirm("Är du säker på att du vill ta bort detta företag? Detta kan inte ångras.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("tenants")
        .delete()
        .eq("id", tenantId);

      if (error) throw error;
      toast.success("Företag borttaget");
      setSelectedTenant(null);
      loadAdminData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna användare? Detta kan inte ångras.")) {
      return;
    }

    try {
      // Delete user roles first
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (roleError) throw roleError;

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      toast.success("Användare borttagen");
      setSelectedUser(null);
      loadAdminData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    try {
      if (currentRole === "admin") {
        // Remove admin role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");

        if (error) throw error;
        toast.success("Admin-rollen borttagen");
      } else {
        // Get user's tenant
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("tenant_id")
          .eq("user_id", userId)
          .single();

        if (!userRole) throw new Error("Användaren har ingen tenant");

        // Add admin role
        const { error } = await supabase
          .from("user_roles")
          .insert({
            user_id: userId,
            tenant_id: userRole.tenant_id,
            role: "admin",
          });

        if (error) throw error;
        toast.success("Admin-rollen tillagd");
      }

      loadAdminData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateAffiliateStatus = async (affiliateId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("affiliates")
        .update({ status: newStatus })
        .eq("id", affiliateId);

      if (error) throw error;
      toast.success("Status uppdaterad");
      setSelectedAffiliate(null);
      loadAdminData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteAffiliate = async (affiliateId: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna affiliate? Detta kan inte ångras.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("affiliates")
        .delete()
        .eq("id", affiliateId);

      if (error) throw error;
      toast.success("Affiliate borttagen");
      setSelectedAffiliate(null);
      loadAdminData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const startLeadFinder = async () => {
    setLeadFinderRunning(true);
    setLeadFinderProgress(0);
    setLeadFinderStatus("Starting...");
    
    try {
      const cities = leadFinderCities.split(',').map(c => c.trim()).filter(Boolean);
      const businessTypes = leadFinderBusinessTypes.split(',').map(b => b.trim()).filter(Boolean);
      
      if (cities.length === 0 || businessTypes.length === 0) {
        toast.error("Please enter at least one city and one business type");
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('start-lead-finder', {
        body: {
          cities,
          businessTypes,
          maxResultsPerCity: leadFinderMaxResults,
        },
      });
      
      if (error) throw error;
      
      setLeadFinderJobId(data.jobId);
      setLeadFinderStatus(`Job started! Found ${data.totalLeads} leads.`);
      toast.success(`Lead finder completed! Found ${data.totalLeads} leads.`);
      
      // Poll for job status
      pollLeadFinderStatus(data.jobId);
    } catch (error: any) {
      console.error('Error starting lead finder:', error);
      toast.error(error.message || "Failed to start lead finder");
      setLeadFinderRunning(false);
    }
  };
  
  const pollLeadFinderStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const { data: job, error } = await supabase
          .from('lead_finder_jobs')
          .select('status, progress')
          .eq('id', jobId)
          .single();
        
        if (error) throw error;
        
        setLeadFinderProgress(job.progress || 0);
        setLeadFinderStatus(`Running... ${job.progress}% complete`);
        
        if (job.status === 'completed' || job.status === 'failed') {
          clearInterval(interval);
          setLeadFinderRunning(false);
          
          if (job.status === 'completed') {
            setLeadFinderStatus("Completed! Ready to download.");
          } else {
            setLeadFinderStatus("Failed. Please try again.");
          }
        }
      } catch (error) {
        console.error('Error polling job status:', error);
        clearInterval(interval);
        setLeadFinderRunning(false);
      }
    }, 2000); // Poll every 2 seconds
  };
  
  const downloadLeadCSV = async (city?: string) => {
    if (!leadFinderJobId) {
      toast.error("No job to download");
      return;
    }
    
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-lead-csv?jobId=${leadFinderJobId}${city ? `&city=${encodeURIComponent(city)}` : ''}`;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download CSV');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `leads_${city || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success("CSV downloaded successfully!");
    } catch (error: any) {
      console.error('Error downloading CSV:', error);
      toast.error(error.message || "Failed to download CSV");
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error("Ange en email-adress");
      return;
    }

    setAddingAdmin(true);
    try {
      // Find user by email
      const response = await supabase.auth.admin.listUsers();
      if (response.error) throw response.error;

      const users = response.data.users || [];
      const user = users.find((u: any) => u.email === newAdminEmail);
      if (!user) {
        toast.error("Användaren finns inte");
        return;
      }

      // Check if already admin
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (existingRole) {
        toast.error("Användaren är redan admin");
        return;
      }

      // Get user's tenant
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (!userRole) {
        toast.error("Användaren har ingen tenant");
        return;
      }

      // Add admin role
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: user.id,
          tenant_id: userRole.tenant_id,
          role: "admin",
        });

      if (error) throw error;

      toast.success("Admin tillagd!");
      setNewAdminEmail("");
      loadAdminData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAddingAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span className="text-lg font-medium">Laddar admin-panel...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 premium-glow">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground">Hantera användare, företag och meddelanden</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <Card 
          className="glass-card cursor-pointer hover-lift premium-glow animate-fade-in stagger-1"
          onClick={() => setShowTenantsDialog(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt Företag</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{tenants.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Klicka för att se lista</p>
          </CardContent>
        </Card>

        <Card 
          className="glass-card cursor-pointer hover-lift premium-glow animate-fade-in stagger-2"
          onClick={() => setShowUsersDialog(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt Användare</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
              <Users className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{userRoles.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Klicka för att se lista</p>
          </CardContent>
        </Card>

        <Card className="glass-card premium-glow animate-fade-in stagger-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nya Meddelanden</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10">
              <MessageSquare className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">
              {contactMessages.filter(m => m.status === 'new').length}
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card cursor-pointer hover-lift premium-glow animate-fade-in stagger-4"
          onClick={() => setShowPayingDialog(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Betalande Kunder</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent-glow/20 to-accent-glow/10">
              <BarChart className="h-4 w-4 text-accent-glow" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">
              {tenants.filter(t => t.plan !== 'starter').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Klicka för att se lista</p>
          </CardContent>
        </Card>

        <Card className="glass-card premium-glow animate-fade-in stagger-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-glow/20 to-primary-glow/10">
              <Gift className="h-4 w-4 text-primary-glow" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{referrals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Aktiva referrals</p>
          </CardContent>
        </Card>

        <Card className="glass-card premium-glow animate-fade-in stagger-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliates</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
              <UserCheck className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{affiliates.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {affiliates.filter(a => a.status === 'pending').length} väntande
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="tenants" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
            <Building2 className="h-4 w-4 mr-2" />
            Företag
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4 mr-2" />
            Användare
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
            <MessageSquare className="h-4 w-4 mr-2" />
            Meddelanden
          </TabsTrigger>
          <TabsTrigger value="referrals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
            <Gift className="h-4 w-4 mr-2" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="affiliates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
            <UserCheck className="h-4 w-4 mr-2" />
            Affiliates
          </TabsTrigger>
          <TabsTrigger value="lead-finder" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
            <Search className="h-4 w-4 mr-2" />
            Lead Finder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <Card className="glass-card premium-glow animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="gradient-text">Alla Företag</CardTitle>
                  <CardDescription>Översikt över alla registrerade företag</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border glass-card">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skapad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant, idx) => (
                    <TableRow key={tenant.id} className={`hover-lift stagger-${(idx % 5) + 1}`}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary border-primary/20" variant={tenant.plan === 'enterprise' ? 'default' : tenant.plan === 'professional' ? 'secondary' : 'outline'}>
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-accent/10 text-accent border-accent/20" variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(tenant.created_at).toLocaleDateString('sv-SE')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="glass-card premium-glow animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="gradient-text">Användarroller</CardTitle>
                  <CardDescription>Alla användare och deras roller</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border glass-card">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Roll</TableHead>
                    <TableHead>Tenant ID</TableHead>
                    <TableHead>Skapad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((role, idx) => (
                    <TableRow key={role.id} className={`hover-lift stagger-${(idx % 5) + 1}`}>
                      <TableCell className="font-mono text-xs">{role.user_id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <Badge className={role.role === 'admin' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-primary/10 text-primary border-primary/20'} variant={role.role === 'admin' ? 'destructive' : role.role === 'owner' ? 'default' : 'secondary'}>
                          {role.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{role.tenant_id.slice(0, 8)}...</TableCell>
                      <TableCell>{new Date(role.created_at).toLocaleDateString('sv-SE')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card className="glass-card premium-glow animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10">
                  <MessageSquare className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="gradient-text">Kontaktmeddelanden</CardTitle>
                  <CardDescription>Meddelanden från kontaktformuläret</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border glass-card">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ämne</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead className="text-right">Åtgärd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Inga meddelanden ännu
                      </TableCell>
                    </TableRow>
                  ) : (
                    contactMessages.map((message, idx) => (
                      <TableRow key={message.id} className={`hover-lift stagger-${(idx % 5) + 1}`}>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                        <TableCell>
                          <Badge className={message.status === 'new' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-muted/50 text-muted-foreground'} variant={message.status === 'new' ? 'default' : 'secondary'}>
                            {message.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(message.created_at).toLocaleDateString('sv-SE')}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover-scale"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <Card className="glass-card premium-glow animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-glow/20 to-primary-glow/10">
                  <Gift className="h-5 w-5 text-primary-glow" />
                </div>
                <div>
                  <CardTitle className="gradient-text">Refer-a-Friend Program</CardTitle>
                  <CardDescription>Alla aktiva referrals och deras statistik</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border glass-card">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Referral Kod</TableHead>
                    <TableHead>Referenser</TableHead>
                    <TableHead>Total Provision</TableHead>
                    <TableHead>Provisionssats</TableHead>
                    <TableHead>Skapad</TableHead>
                    <TableHead className="text-right">Åtgärd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Inga referrals ännu
                      </TableCell>
                    </TableRow>
                  ) : (
                    referrals.map((referral, idx) => (
                      <TableRow key={referral.id} className={`hover-lift stagger-${(idx % 5) + 1}`}>
                        <TableCell className="font-medium">{referral.email}</TableCell>
                        <TableCell className="font-mono text-xs">{referral.referral_code}</TableCell>
                        <TableCell>{referral.referred_count}</TableCell>
                        <TableCell>${Number(referral.total_commission).toFixed(2)}</TableCell>
                        <TableCell>{(Number(referral.commission_rate) * 100).toFixed(0)}%</TableCell>
                        <TableCell>{new Date(referral.created_at).toLocaleDateString('sv-SE')}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover-scale"
                            onClick={() => setSelectedReferral(referral)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-4">
          <Card className="glass-card premium-glow animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
                  <UserCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="gradient-text">Affiliate Program</CardTitle>
                  <CardDescription>Alla affiliate-ansökningar och partners</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border glass-card">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Företag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Referenser</TableHead>
                    <TableHead>Total Provision</TableHead>
                    <TableHead>Skapad</TableHead>
                    <TableHead className="text-right">Åtgärd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Inga affiliates ännu
                      </TableCell>
                    </TableRow>
                  ) : (
                    affiliates.map((affiliate, idx) => (
                      <TableRow key={affiliate.id} className={`hover-lift stagger-${(idx % 5) + 1}`}>
                        <TableCell className="font-medium">{affiliate.name}</TableCell>
                        <TableCell>{affiliate.email}</TableCell>
                        <TableCell>{affiliate.company || "-"}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              affiliate.status === 'approved' ? 'bg-accent/10 text-accent border-accent/20' : 
                              affiliate.status === 'rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                              'bg-muted/50 text-muted-foreground'
                            }
                            variant={
                              affiliate.status === 'approved' ? 'default' : 
                              affiliate.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }
                          >
                            {affiliate.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{affiliate.referred_count}</TableCell>
                        <TableCell>${Number(affiliate.total_commission).toFixed(2)}</TableCell>
                        <TableCell>{new Date(affiliate.created_at).toLocaleDateString('sv-SE')}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover-scale"
                            onClick={() => setSelectedAffiliate(affiliate)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lead-finder" className="space-y-4">
          <Card className="glass-card premium-glow animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="gradient-text">AI Lead Finder</CardTitle>
                  <CardDescription>Find businesses and extract contact information using Google Places</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cities">Cities (comma-separated)</Label>
                  <Input
                    id="cities"
                    value={leadFinderCities}
                    onChange={(e) => setLeadFinderCities(e.target.value)}
                    placeholder="Stockholm, Gothenburg, Malmö"
                    disabled={leadFinderRunning}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter city names separated by commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessTypes">Business Types (comma-separated)</Label>
                  <Input
                    id="businessTypes"
                    value={leadFinderBusinessTypes}
                    onChange={(e) => setLeadFinderBusinessTypes(e.target.value)}
                    placeholder="hotel, restaurant, cafeteria, bar"
                    disabled={leadFinderRunning}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter business types separated by commas (e.g., hotel, restaurant)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxResults">Max Results per City</Label>
                  <Input
                    id="maxResults"
                    type="number"
                    value={leadFinderMaxResults}
                    onChange={(e) => setLeadFinderMaxResults(Number(e.target.value))}
                    min={1}
                    max={500}
                    disabled={leadFinderRunning}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of results per city (1-500)
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={startLeadFinder}
                    disabled={leadFinderRunning}
                    className="flex-1"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {leadFinderRunning ? "Running..." : "Run Lead Finder"}
                  </Button>
                  
                  {leadFinderJobId && !leadFinderRunning && (
                    <Button
                      onClick={() => downloadLeadCSV()}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All CSV
                    </Button>
                  )}
                </div>

                {leadFinderStatus && (
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Status:</p>
                    <p className="text-sm text-muted-foreground">{leadFinderStatus}</p>
                    {leadFinderRunning && leadFinderProgress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{leadFinderProgress}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${leadFinderProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="glass-card p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-primary">How it works:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Searches Google Places for businesses matching your criteria</li>
                    <li>Extracts official websites from Place Details</li>
                    <li>Crawls websites to find business email addresses (info@, contact@, etc.)</li>
                    <li>Filters out personal emails (gmail, outlook, etc.)</li>
                    <li>Generates downloadable CSV files with all findings</li>
                    <li>Rate limited to 1 job per minute per admin</li>
                  </ul>
                </div>

                {leadFinderJobId && !leadFinderRunning && (
                  <div className="glass-card p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-primary">Download by City:</h4>
                    <div className="flex flex-wrap gap-2">
                      {leadFinderCities.split(',').map(city => city.trim()).filter(Boolean).map(city => (
                        <Button
                          key={city}
                          variant="outline"
                          size="sm"
                          onClick={() => downloadLeadCSV(city)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {city}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl glass-card border-2 border-primary/20">
          <DialogHeader>
            <DialogTitle className="gradient-text">Meddelande från {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              {selectedMessage?.email} • {selectedMessage && new Date(selectedMessage.created_at).toLocaleString('sv-SE')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="glass-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-primary">Ämne</h4>
              <p className="text-muted-foreground">{selectedMessage?.subject}</p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-primary">Meddelande</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tenants List Dialog */}
      <Dialog open={showTenantsDialog} onOpenChange={setShowTenantsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Alla Företag ({tenants.length})
            </DialogTitle>
            <DialogDescription>
              Fullständig lista över alla registrerade företag
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <Input
              placeholder="Sök företag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Skapad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants
                .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((tenant) => (
                  <TableRow 
                    key={tenant.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedTenant(tenant)}
                  >
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>
                      <Badge variant={tenant.plan === 'enterprise' ? 'default' : tenant.plan === 'professional' ? 'secondary' : 'outline'}>
                        {tenant.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(tenant.created_at).toLocaleDateString('sv-SE')}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Tenant Detail Dialog */}
      <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Företag: {selectedTenant?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">ID</Label>
              <p className="text-sm font-mono text-muted-foreground">{selectedTenant?.id}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Plan</Label>
              <div className="mt-1">
                <Badge variant={selectedTenant?.plan === 'enterprise' ? 'default' : selectedTenant?.plan === 'professional' ? 'secondary' : 'outline'}>
                  {selectedTenant?.plan}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Status</Label>
              <div className="mt-1">
                <Badge variant={selectedTenant?.status === 'active' ? 'default' : 'secondary'}>
                  {selectedTenant?.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Skapad</Label>
              <p className="text-sm text-muted-foreground">
                {selectedTenant && new Date(selectedTenant.created_at).toLocaleString('sv-SE')}
              </p>
            </div>
            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  if (selectedTenant) {
                    deleteTenant(selectedTenant.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Ta bort företag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Users List Dialog */}
      <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Alla Användare ({detailedUsers.length})
            </DialogTitle>
            <DialogDescription>
              Fullständig lista över alla användare och deras roller
            </DialogDescription>
          </DialogHeader>
          
          {/* Add Admin Section */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Lägg till Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                type="email"
                placeholder="Användarens email..."
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
              <Button
                onClick={addAdmin}
                disabled={addingAdmin}
                className="w-full"
              >
                {addingAdmin ? "Lägger till..." : "Lägg till som admin"}
              </Button>
            </CardContent>
          </Card>

          <div className="mb-4">
            <Input
              placeholder="Sök användare..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Företag</TableHead>
                <TableHead>Skapad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailedUsers
                .filter(u => 
                  u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                  u.tenant_name.toLowerCase().includes(userSearchTerm.toLowerCase())
                )
                .map((user) => (
                  <TableRow 
                    key={user.user_id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'owner' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.tenant_name}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString('sv-SE')}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Användare: {selectedUser?.email}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Email</Label>
              <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">User ID</Label>
              <p className="text-sm font-mono text-muted-foreground">{selectedUser?.user_id}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Roll</Label>
              <div className="mt-1">
                <Badge variant={selectedUser?.role === 'admin' ? 'destructive' : selectedUser?.role === 'owner' ? 'default' : 'secondary'}>
                  {selectedUser?.role}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Företag</Label>
              <p className="text-sm text-muted-foreground">{selectedUser?.tenant_name}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Tenant ID</Label>
              <p className="text-sm font-mono text-muted-foreground">{selectedUser?.tenant_id}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Skapad</Label>
              <p className="text-sm text-muted-foreground">
                {selectedUser && new Date(selectedUser.created_at).toLocaleString('sv-SE')}
              </p>
            </div>
            <div className="pt-4 border-t space-y-2">
              {selectedUser?.role !== 'admin' ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (selectedUser) {
                      toggleAdminRole(selectedUser.user_id, selectedUser.role);
                      setSelectedUser(null);
                    }
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gör till admin
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (selectedUser) {
                      toggleAdminRole(selectedUser.user_id, selectedUser.role);
                      setSelectedUser(null);
                    }
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ta bort admin-roll
                </Button>
              )}
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  if (selectedUser) {
                    deleteUser(selectedUser.user_id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Ta bort användare
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Paying Customers Dialog */}
      <Dialog open={showPayingDialog} onOpenChange={setShowPayingDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Betalande Kunder ({tenants.filter(t => t.plan !== 'starter').length})
            </DialogTitle>
            <DialogDescription>
              Företag med Professional eller Enterprise plan
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Skapad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants
                .filter(t => t.plan !== 'starter')
                .map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>
                      <Badge variant={tenant.plan === 'enterprise' ? 'default' : 'secondary'}>
                        {tenant.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(tenant.created_at).toLocaleDateString('sv-SE')}</TableCell>
                  </TableRow>
                ))}
              {tenants.filter(t => t.plan !== 'starter').length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Inga betalande kunder ännu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Referral Detail Dialog */}
      <Dialog open={!!selectedReferral} onOpenChange={() => setSelectedReferral(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Referral Detaljer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Email</Label>
              <p className="text-sm text-muted-foreground">{selectedReferral?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Referral Kod</Label>
              <p className="text-sm font-mono text-muted-foreground">{selectedReferral?.referral_code}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Antal Referenser</Label>
              <p className="text-sm text-muted-foreground">{selectedReferral?.referred_count}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Total Provision Intjänad</Label>
              <p className="text-sm text-muted-foreground">
                ${Number(selectedReferral?.total_commission).toFixed(2)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Provisionssats</Label>
              <p className="text-sm text-muted-foreground">
                {selectedReferral && (Number(selectedReferral.commission_rate) * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Skapad</Label>
              <p className="text-sm text-muted-foreground">
                {selectedReferral && new Date(selectedReferral.created_at).toLocaleString('sv-SE')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Affiliate Detail Dialog */}
      <Dialog open={!!selectedAffiliate} onOpenChange={() => setSelectedAffiliate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Affiliate Detaljer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Namn</Label>
              <p className="text-sm text-muted-foreground">{selectedAffiliate?.name}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Email</Label>
              <p className="text-sm text-muted-foreground">{selectedAffiliate?.email}</p>
            </div>
            {selectedAffiliate?.company && (
              <div>
                <Label className="text-sm font-semibold">Företag</Label>
                <p className="text-sm text-muted-foreground">{selectedAffiliate.company}</p>
              </div>
            )}
            {selectedAffiliate?.website && (
              <div>
                <Label className="text-sm font-semibold">Webbplats</Label>
                <a 
                  href={selectedAffiliate.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {selectedAffiliate.website}
                </a>
              </div>
            )}
            <div>
              <Label className="text-sm font-semibold">Marknadsföringsstrategi</Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedAffiliate?.description}
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Målgrupp</Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedAffiliate?.audience}
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Status</Label>
              <div className="mt-1">
                <Badge 
                  variant={
                    selectedAffiliate?.status === 'approved' ? 'default' : 
                    selectedAffiliate?.status === 'rejected' ? 'destructive' : 
                    'secondary'
                  }
                >
                  {selectedAffiliate?.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-semibold">Referenser</Label>
                <p className="text-sm text-muted-foreground">{selectedAffiliate?.referred_count}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Total Provision</Label>
                <p className="text-sm text-muted-foreground">
                  ${Number(selectedAffiliate?.total_commission).toFixed(2)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Provisionssats</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedAffiliate && (Number(selectedAffiliate.commission_rate) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Skapad</Label>
              <p className="text-sm text-muted-foreground">
                {selectedAffiliate && new Date(selectedAffiliate.created_at).toLocaleString('sv-SE')}
              </p>
            </div>
            
            {selectedAffiliate?.status === 'pending' && (
              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    if (selectedAffiliate) {
                      updateAffiliateStatus(selectedAffiliate.id, 'approved');
                    }
                  }}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Godkänn Ansökan
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    if (selectedAffiliate) {
                      updateAffiliateStatus(selectedAffiliate.id, 'rejected');
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Avslå Ansökan
                </Button>
              </div>
            )}
            
            {selectedAffiliate?.status !== 'pending' && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    if (selectedAffiliate) {
                      deleteAffiliate(selectedAffiliate.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Ta bort Affiliate
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
