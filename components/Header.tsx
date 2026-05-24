"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const Header = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const linkClass = (href: string) => {
    const isThreadsIndexActive =
      href === "/threads" &&
      (pathname === "/threads" ||
        (pathname.startsWith("/threads/") && pathname !== "/threads/new"));
    const isActive = pathname === href || isThreadsIndexActive;
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted hover:text-foreground hover:bg-foreground/5"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <nav className="flex items-center gap-1">
            <Link href="/threads" className={linkClass("/threads")}>
              スレッド一覧
            </Link>
            <Link href="/threads/new" className={linkClass("/threads/new")}>
              スレッド作成
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              About
            </Link>
          </nav>
          <button
            onClick={handleLogOut}
            className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:text-danger transition-colors cursor-pointer"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
};
