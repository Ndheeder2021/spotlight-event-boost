import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Sparkles, Minimize2, Zap, Clock } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const quickReplies = [
  "Hur fungerar plattformen?",
  "Vilka priser har ni?",
  "Hur skapar jag en kampanj?",
  "Visa en demo",
];

export function LiveChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hej! 👋 Välkommen till Spotlight.\n\nJag är här för att hjälpa dig med frågor om vår event-marknadsföringsplattform. Vad kan jag hjälpa dig med?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    setShowQuickReplies(false);
    
    const userMessage: Message = { 
      role: 'user', 
      content: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let messageAdded = false;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  
                  setMessages(prev => {
                    const newMessages = [...prev];
                    if (!messageAdded) {
                      newMessages.push({ 
                        role: 'assistant', 
                        content: assistantMessage,
                        timestamp: new Date()
                      });
                      messageAdded = true;
                    } else {
                      newMessages[newMessages.length - 1].content = assistantMessage;
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ursäkta, något gick fel. Försök igen eller kontakta oss direkt på support@spotlightevents.online',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
      {/* Chat Button - Animated with glow effect */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-[9999] group relative"
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
        <Card className={`fixed right-6 w-[420px] shadow-2xl flex flex-col z-[9999] border-2 border-primary/20 backdrop-blur-sm bg-background/95 transition-all duration-300 animate-in slide-in-from-bottom-4 ${
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
                  Spotlight Support
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
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-accent/50 text-accent-foreground rounded-bl-sm border border-border/50'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                      <div className="bg-accent/50 rounded-2xl rounded-bl-sm px-4 py-3 border border-border/50">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Skriver...</span>
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
                  Powered by AI • Streaming-svar i realtid
                </p>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}
