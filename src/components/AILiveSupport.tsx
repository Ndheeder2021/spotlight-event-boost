import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Loader2, Sparkles, Minimize2, Zap, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const quickReplies = [
  "Hur fungerar plattformen?",
  "Vilka priser har ni?",
  "Hur skapar jag en kampanj?",
  "Kontakta support",
];

export const AILiveSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hej! 👋 Jag heter Emilie och är din AI-assistent. Jag hjälper dig gärna med frågor om Spotlight och vår plattform.\n\nVad kan jag hjälpa dig med idag?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput("");
    setShowQuickReplies(false);
    
    const userMessage: Message = { 
      role: "user", 
      content: messageText,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-support-chat", {
        body: { message: messageText, history: messages },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: data.response,
          timestamp: new Date()
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Kunde inte skicka meddelande",
        description: "Försök igen om en stund.",
        variant: "destructive",
      });
      
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Ursäkta, jag kunde inte svara just nu. Försök igen eller kontakta oss direkt på support@spotlightevents.online",
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Button - Animated with notification pulse */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 group relative"
        size="icon"
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-20 group-hover:opacity-30" />
        {isOpen ? (
          <X className="h-7 w-7 relative z-10" />
        ) : (
          <>
            <MessageCircle className="h-7 w-7 relative z-10" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-accent-foreground" />
            </div>
          </>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed right-6 w-[420px] shadow-2xl flex flex-col z-50 border-2 border-primary/20 backdrop-blur-sm bg-background/95 transition-all duration-300 ${
          isMinimized ? "bottom-24 h-16" : "bottom-24 h-[600px]"
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-primary animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  Emilie
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/20 text-white border-white/30">
                    <Zap className="h-2.5 w-2.5 mr-0.5" />
                    AI
                  </Badge>
                </h3>
                <div className="flex items-center gap-1.5 text-xs opacity-90">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Online • Svarar inom sekunder</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setIsMinimized(!isMinimized)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-accent/50 text-accent-foreground rounded-bl-sm border border-border/50"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                      <div className="bg-accent/50 rounded-2xl rounded-bl-sm px-4 py-3 border border-border/50">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Emilie skriver...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Replies */}
                  {showQuickReplies && messages.length === 1 && !isLoading && (
                    <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-xs text-muted-foreground text-center">Snabba svar:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickReplies.map((reply, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => sendMessage(reply)}
                            className="h-auto py-2 px-3 text-xs hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-background/50 backdrop-blur-sm rounded-b-lg">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Skriv ditt meddelande... (Enter för att skicka)"
                    disabled={isLoading}
                    className="flex-1 rounded-full border-2 focus:border-primary transition-all"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="rounded-full h-10 w-10 shadow-md hover:shadow-lg transition-all hover:scale-110 disabled:scale-100"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Powered by AI • Svarar vanligtvis inom 2-5 sekunder
                </p>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
};
