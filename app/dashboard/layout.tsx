import { Sidebar } from "@/components/Layout/sidebar";
import Navbar from "@/components/Layout/Navbar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />
      <div className="flex h-screen pt-[65px]">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
