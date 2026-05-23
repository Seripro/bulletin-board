import { ThreadsType } from "@/types/threads";
import { UserType } from "@/types/user";
import Link from "next/link";

export default async function Threads() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/threads`, {
    cache: "no-store",
  });
  const threads: ThreadsType[] = await res.json();
  const userRes = await Promise.all(
    threads.map((thread) =>
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${thread.user_id}`, {
        cache: "no-store",
      }),
    ),
  );
  const users: UserType[] = await Promise.all(
    userRes.map(async (res) => res.json()),
  );

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
