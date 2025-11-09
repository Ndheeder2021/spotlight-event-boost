import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={true}
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-border group-[.toaster]:rounded-xl group-[.toaster]:shadow-2xl group-[.toaster]:p-4 group-[.toaster]:animate-fade-in group-[.toaster]:min-w-[320px] group-[.toaster]:max-w-[500px]",
          description: "group-[.toast]:text-foreground/80 group-[.toast]:text-sm group-[.toast]:leading-5",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2.5 group-[.toast]:hover:opacity-90 group-[.toast]:hover:scale-[1.02] group-[.toast]:transition-all group-[.toast]:duration-150",
          cancelButton: "group-[.toast]:text-foreground group-[.toast]:text-sm group-[.toast]:underline group-[.toast]:hover:text-primary group-[.toast]:transition-colors group-[.toast]:duration-300 group-[.toast]:bg-transparent",
          success: "group-[.toaster]:border-accent/50 group-[.toaster]:bg-accent/5",
          error: "group-[.toaster]:border-destructive/50 group-[.toaster]:bg-destructive/5",
          warning: "group-[.toaster]:border-warning/50 group-[.toaster]:bg-warning/5",
          info: "group-[.toaster]:border-primary/50 group-[.toaster]:bg-primary/5",
          title: "group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:mb-1 group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
