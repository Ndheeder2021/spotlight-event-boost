import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/mobile-optimizations.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./i18n/config";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
    <App />
  </ThemeProvider>
);
