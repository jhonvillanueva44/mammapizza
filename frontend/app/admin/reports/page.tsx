'use client';

import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import ReportsPanel from '@/components/adminComponents/ReportsPanel';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Reportes" />
        <main className="p-6">
          <ReportsPanel />
        </main>
      </div>
    </div>
  );
}
