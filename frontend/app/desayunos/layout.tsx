// app/menu/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import DesayunosNav from "@/components/DesayunosNav";

export default function DesayunosLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <DesayunosNav />

      {children}
    </main>
  );
}
