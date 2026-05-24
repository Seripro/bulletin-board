import { notFound } from "next/navigation";
import CommentForm from "./CommentForm";
import { createClient } from "@/utils/supabase/server";
import { deleteComment } from "./deleteComment";

type Props = {
  params: { id: string }; // URLの /threads/abc123 → id = "abc123"
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
    <div>
      <p>{id}</p>
      <h1>{thread.title}</h1>
      <p>{thread.content}</p>
      <p>{thread.created_at}</p>
      <p>コメント</p>
      <CommentForm threadId={id} />
      {comments?.map((comment) => {
        return (
          <div key={comment.id}>
            <div>
              <p>{comment.content}</p>
              {user?.id === comment.user_id ? (
                <form action={deleteComment.bind(null, comment.id, id)}>
                  <button type="submit">削除</button>
                </form>
              ) : null}
            </div>
            <p>
              {users.filter((user) => user?.id == comment.user_id)[0]?.name ??
                "名無し"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
