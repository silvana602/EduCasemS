"use client";

import RoleGate from "@/components/auth/RoleGate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGate allow={["student", "admin", "instructor"]}>
            <div className="flex gap-6">
                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </RoleGate>
    );
}