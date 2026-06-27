import { LanguageProvider } from "@/components/portal/LanguageProvider";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
