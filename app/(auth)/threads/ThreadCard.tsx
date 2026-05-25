import { ThreadsType } from "@/types/threads";
import { UserType } from "@/types/user";
import Link from "next/link";

type Props = {
  thread: ThreadsType;
  user: UserType;
};

function ThreadCard(props: Props) {
  const { thread, user } = props;
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
        <span className="text-sm text-muted">{user?.name ?? "名無し"}</span>
        <span className="ml-auto text-xs text-muted">
          {new Date(thread.created_at).toLocaleDateString("ja-JP")}
        </span>
      </div>
      <h2 className="text-lg font-semibold">{thread.title}</h2>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{thread.content}</p>
    </Link>
  );
}

export default ThreadCard;
