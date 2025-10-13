"use client";

import RoleGate from "@/components/auth/RoleGate";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGate allow={["student", "admin", "instructor"]}>
            <div className="flex gap-6">
                {/* Sidebar SOLO en el layout de dashboard (no en admin/instructor) */}
                <Sidebar />
                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </RoleGate>
    );
}