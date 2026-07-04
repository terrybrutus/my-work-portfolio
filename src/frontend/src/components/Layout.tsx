import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type * as React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
