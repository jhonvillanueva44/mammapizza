
import DesayunosNav from "@/components/DesayunosNav";
import { ReactNode } from "react";


export default function DesayunosLayout({ children }: { children: ReactNode }) {
  return (
    <main className="pt-16"> 
      < DesayunosNav />
      {children}
    </main>
  );
}
