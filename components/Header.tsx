import { useAuth } from "@/hooks/useAuth";
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
      <button onClick={handleLogOut}>ログアウト</button>
    </div>
  );
};
