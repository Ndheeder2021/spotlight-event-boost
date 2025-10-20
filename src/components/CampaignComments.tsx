import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface Comment {
  id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  is_internal: boolean;
  created_at: string;
}

interface CampaignCommentsProps {
  campaignId: string;
  tenantId: string;
}

export function CampaignComments({ campaignId, tenantId }: CampaignCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    loadComments();
    loadUserInfo();
  }, [campaignId]);

  const loadUserInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setAuthorName(user.email?.split('@')[0] || "");
      setAuthorEmail(user.email || "");
      setIsInternal(true);
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from("campaign_comments")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      toast.error("Kunde inte ladda kommentarer");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !authorName.trim()) {
      toast.error("Fyll i namn och kommentar");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("campaign_comments")
        .insert({
          campaign_id: campaignId,
          tenant_id: tenantId,
          user_id: user?.id || null,
          author_name: authorName,
          author_email: authorEmail || null,
          content: newComment,
          is_internal: isInternal,
        });

      if (error) throw error;

      toast.success("Kommentar tillagd!");
      setNewComment("");
      loadComments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Kommentarer ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Namn *</Label>
              <Input
                id="name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ditt namn"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (valfritt)</Label>
              <Input
                id="email"
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="din@email.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="comment">Kommentar *</Label>
            <Textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Skriv din kommentar här..."
              rows={4}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Skicka kommentar
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Inga kommentarer ännu. Var först med att kommentera!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg border ${
                  comment.is_internal ? "bg-accent/5 border-accent/20" : "bg-background"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{comment.author_name}</p>
                    {comment.author_email && (
                      <p className="text-xs text-muted-foreground">{comment.author_email}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(comment.created_at), "PPP HH:mm", { locale: sv })}
                    {comment.is_internal && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
                        Intern
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
