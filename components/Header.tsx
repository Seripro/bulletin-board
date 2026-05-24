import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const handleLogOut = async () => {
    await signOut();
    router.replace("/login");
  };
  return (
    <div>
      <Link href="/threads">スレッド一覧</Link>
      <Link href="/threads/new">スレッド作成</Link>
      <Link href="/about">About</Link>
      <button onClick={handleLogOut}>ログアウト</button>
    </div>
  );
};
