"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { signOut } = useAuth();
  const router = useRouter();
  const handleLogOut = async () => {
    await signOut();
    router.replace("/login");
  };
  return (
    <div>
      <button onClick={handleLogOut}>ログアウト</button>
    </div>
  );
}
