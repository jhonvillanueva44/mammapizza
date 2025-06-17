// app/menu/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import MenuNav from "@/components/MenuNav";

export default function MenuLayout({ children }: { children: ReactNode }) {
  return (
    <main className="pt-16"> 
      <MenuNav />
      {children}
    </main>
  );
}
