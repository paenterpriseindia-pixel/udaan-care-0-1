import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div style={{ background: "var(--bg)", minHeight: "100vh" }}>{children}</div>;
}
