"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-8 h-8 text-muted-foreground hover:text-red-600"
      onClick={handleLogout}
      disabled={loading}
      title="Keluar"
    >
      <LogOut className="w-4 h-4" />
    </Button>
  );
}
