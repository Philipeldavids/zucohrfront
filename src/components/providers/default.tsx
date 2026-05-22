//import { AuthProvider } from "./auth.tsx";
//import { ConvexProvider } from "./convex.tsx";
import { QueryClientProvider } from "./query-client.tsx";
import { ThemeProvider } from "./theme.tsx";
import { Toaster } from "sonner";
//import { TooltipProvider } from "../ui/tooltip.tsx";

export function DefaultProviders({ children }: { children: React.ReactNode }) {
  return (
    
      
        <QueryClientProvider>          
            <ThemeProvider>
              <Toaster />
              {children}
            </ThemeProvider>          
        </QueryClientProvider>
     
    
  );
}
