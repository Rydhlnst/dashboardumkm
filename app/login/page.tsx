"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login gagal.");
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background border border-border rounded-2xl shadow-sm p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Masuk ke Dashboard</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Gunakan akun admin yang diberikan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-9 h-9 text-sm"
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-9 h-9 text-sm"
              autoComplete="current-password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-9 text-sm bg-red-600 hover:bg-red-700 text-white"
          disabled={loading || !username || !password}
        >
          {loading ? "Memverifikasi..." : "Masuk"}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center mb-3 shadow-sm">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Alfamidi UMKM</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Branch Palu — Sulawesi Tengah</p>
        </div>

        <Suspense fallback={<div className="bg-background border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">Memuat...</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Alfamidi UMKM Dashboard © 2025
        </p>
      </div>
    </div>
  );
}
