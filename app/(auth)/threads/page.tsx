import { createClient } from "@/utils/supabase/server";
import { UserType } from "@/types/user";
import ThreadCard from "./ThreadCard";

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
            const user = users.filter((user) => user.id === thread.user_id)[0];
            return <ThreadCard key={thread.id} thread={thread} user={user} />;
          })}
        </div>
      )}
    </div>
  );
}
