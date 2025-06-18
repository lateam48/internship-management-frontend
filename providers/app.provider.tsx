import {ThemeProvider , QueryProvider} from "@/providers";
import { Toaster } from "@/components/ui/sonner";

export function AppProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>{children}</QueryProvider>
            <Toaster position={"bottom-right"} richColors={true} closeButton={true} />
        </ThemeProvider>
    )
}