import type { Metadata } from "next";
import DashboardHeader from "@/components/dashboard-header";
import TherapistHours from "@/components/therapist-hours";
import ProtectedRoute from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Hours | Gem 'n' Eyes EPOS",
  description: "Therapist hours management for Gem 'n' Eyes beauty salon",
};

export default function HoursPage() {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <div className="min-h-screen bg-pink-200">
        <DashboardHeader />
        <main className="container mx-auto p-4 pt-24">
          <h1 className="text-2xl font-bold text-pink-800 mb-6">
            Therapist Hours
          </h1>
          <TherapistHours />
        </main>
      </div>
    </ProtectedRoute>
  );
}
