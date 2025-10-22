import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast glass-card group-[.toaster]:bg-background/95 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-primary/20 group-[.toaster]:shadow-elegant premium-glow group-[.toaster]:animate-fade-in",
          description: "group-[.toast]:text-muted-foreground/90",
          actionButton: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-primary group-[.toast]:to-primary-glow group-[.toast]:text-primary-foreground group-[.toast]:shadow-glow group-[.toast]:hover:scale-105 group-[.toast]:transition-transform",
          cancelButton: "group-[.toast]:glass-card group-[.toast]:bg-muted/50 group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/70 group-[.toast]:transition-colors",
          success: "group-[.toaster]:border-accent/30 group-[.toaster]:bg-accent/5",
          error: "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive/5",
          warning: "group-[.toaster]:border-warning/30 group-[.toaster]:bg-warning/5",
          info: "group-[.toaster]:border-primary/30 group-[.toaster]:bg-primary/5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
