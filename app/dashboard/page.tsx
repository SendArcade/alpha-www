"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] px-4 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0A0A1B] rounded-xl p-6 shadow-xl border border-[#232333]">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111122] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Profile Information
              </h2>
              <div className="space-y-2">
                <p>Name: {session?.user?.name}</p>
                <p>Email: {session?.user?.email}</p>
              </div>
            </div>

            <div className="bg-[#111122] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Account Status</h2>
              <div className="space-y-2">
                <p>Status: Active</p>
                <p>Member Since: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
