"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ForAdmin/DashboardHeader";

export default function DashboardAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isAdmin");

    // If not logged in, redirect to the login page
    if (isLoggedIn !== "true") {
      router.push("/"); // Redirect to the login or homepage
    }
  }, [router]);

  return (
    <div className="min-h-[calc(100vh_-_187px)]">
        <DashboardHeader/>
      <main className="p-4">
        {children} {/* This will render the nested routes (pages) */}
      </main>
    </div>
  );
}
