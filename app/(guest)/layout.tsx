"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && session) {
      router.replace("/");
    }
  }, [loading, session, router]);
  if (loading) return <p>loading...</p>;
  return <>{children}</>;
}
