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
      <p>Threads</p>
      {threads?.map((thread) => {
        const user = users.filter((user) => user.id === thread.user_id)[0];
        return (
          <Link href={`/threads/${thread.id}`} key={thread.id}>
            <p>{user?.name ?? "名無し"}</p>
            <p>{thread.title}</p>
            <p>{thread.content}</p>
            <p>{thread.created_at}</p>
          </Link>
        );
      })}
    </div>
  );
}
