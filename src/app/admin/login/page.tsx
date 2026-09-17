import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin · Sign in" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminRequest()) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="glass w-full max-w-sm rounded-3xl p-7">
        <p className="text-muted mb-1 text-xs tracking-[0.3em] uppercase">
          Private
        </p>
        <h1 className="font-display mb-6 text-2xl font-semibold">
          Responses dashboard
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
