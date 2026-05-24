import { notFound } from "next/navigation";
import CommentForm from "./CommentForm";
import { createClient } from "@/utils/supabase/server";
import { deleteComment } from "./deleteComment";

type Props = {
  params: { id: string };
};

export default async function ThreadsDetail({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user");
  console.log(user);
  const { data: thread } = await supabase
    .from("threads")
    .select("*")
    .eq("id", id)
    .single();
  if (!thread) notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("thread_id", id);
  const promises = (comments ?? []).map((comment) =>
    supabase.from("profiles").select("*").eq("id", comment.user_id).single(),
  );

  const res = await Promise.all(promises);
  const users = res.map((r) => r.data);

  return (
    <div className="mx-auto max-w-3xl">
      <article className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">{thread.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {new Date(thread.created_at).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mt-4 whitespace-pre-wrap leading-relaxed">
          {thread.content}
        </p>
      </article>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">
          コメント ({comments?.length ?? 0})
        </h2>
        <CommentForm threadId={id} />

        <div className="mt-5 space-y-3">
          {comments?.map((comment) => {
            return (
              <div
                key={comment.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                  {user?.id === comment.user_id ? (
                    <form action={deleteComment.bind(null, comment.id, id)}>
                      <button
                        type="submit"
                        className="shrink-0 rounded px-2 py-1 text-xs text-muted transition-colors hover:bg-danger/10 hover:text-danger cursor-pointer"
                      >
                        削除
                      </button>
                    </form>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-muted">
                  {users.filter((user) => user?.id == comment.user_id)[0]
                    ?.name ?? "名無し"}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
