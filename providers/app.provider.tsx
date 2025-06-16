import {ThemeProvider} from "@/providers";
import { Toaster } from "@/components/ui/sonner";

export function AppProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster position={"top-right"} richColors={true} />
        </ThemeProvider>
    )
}