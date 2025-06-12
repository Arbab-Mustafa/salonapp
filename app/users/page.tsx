import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard-header";
import UserManagement from "@/components/user-management";
import ProtectedRoute from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Users | Gem 'n' Eyes EPOS",
  description: "User management for Gem 'n' Eyes beauty salon",
};

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <div className="min-h-screen bg-pink-200">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-20">
          <h1 className="text-2xl font-bold text-pink-800 mb-6">
            User Management
          </h1>
          <UserManagement />
        </main>
      </div>
    </ProtectedRoute>
  );
}
