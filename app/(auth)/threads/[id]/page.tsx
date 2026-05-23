import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";
import CommentForm from "./CommentForm";

type Props = {
  params: { id: string }; // URLの /threads/abc123 → id = "abc123"
};

export default async function ThreadsDetail({ params }: Props) {
  const { id } = await params;
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
            <p>{comment.content}</p>
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
