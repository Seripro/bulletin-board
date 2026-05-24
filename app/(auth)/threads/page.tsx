import { createClient } from "@/utils/supabase/server";
import { UserType } from "@/types/user";
import Link from "next/link";

export default async function Threads() {
  const supabase = await createClient();

  const { data: threadsData, error: threadsError } = await supabase
    .from("threads")
    .select("*");
  if (threadsError) {
    throw threadsError;
  }

  const threads = threadsData ?? [];
  const userIds = [...new Set(threads.map((thread) => thread.user_id))];
  const { data: usersData, error: usersError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);
  if (usersError) {
    throw usersError;
  }

  const users: UserType[] = usersData ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">スレッド一覧</h1>
      {threads.length === 0 ? (
        <p className="text-muted">スレッドがまだありません。</p>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => {
            const user = users.filter(
              (user) => user.id === thread.user_id,
            )[0];
            return (
              <Link
                href={`/threads/${thread.id}`}
                key={thread.id}
                className="block rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {(user?.name ?? "名")[0]}
                  </span>
                  <span className="text-sm text-muted">
                    {user?.name ?? "名無し"}
                  </span>
                  <span className="ml-auto text-xs text-muted">
                    {new Date(thread.created_at).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <h2 className="text-lg font-semibold">{thread.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {thread.content}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
