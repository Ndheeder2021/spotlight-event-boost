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
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:rounded-[10px] group-[.toaster]:shadow-[0_20px_30px_rgba(0,0,0,0.15)] group-[.toaster]:p-4 group-[.toaster]:animate-fade-in group-[.toaster]:max-w-[320px]",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:leading-5",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2.5 group-[.toast]:hover:opacity-90 group-[.toast]:hover:scale-[1.02] group-[.toast]:transition-all group-[.toast]:duration-150",
          cancelButton: "group-[.toast]:text-foreground group-[.toast]:text-xs group-[.toast]:underline group-[.toast]:hover:text-primary group-[.toast]:transition-colors group-[.toast]:duration-300 group-[.toast]:bg-transparent",
          success: "group-[.toaster]:border-accent/50",
          error: "group-[.toaster]:border-destructive/50",
          warning: "group-[.toaster]:border-warning/50",
          info: "group-[.toaster]:border-primary/50",
          title: "group-[.toast]:font-semibold group-[.toast]:text-lg group-[.toast]:mb-2",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
