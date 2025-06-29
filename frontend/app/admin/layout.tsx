// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">      
      <main>{children}</main>
    </div>
  );
}
// This layout component wraps the admin pages, providing a consistent background and structure.