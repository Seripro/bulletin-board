// app/threads/[id]/CommentForm.tsx　← クライアントコンポーネント
"use client";

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentForm({ threadId }: { threadId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!content || !content.trim()) {
      setError("コメントを入力してください");
      setLoading(false);
      return;
    } else {
      await supabase.from("comments").insert({ thread_id: threadId, content });
      setContent("");
      router.refresh(); // サーバーコンポーネントを再取得
    }
    setLoading(false);
  };

  if (loading) return <p>loading...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">送信</button>
      </form>
      {error ? <p style={{ color: "red" }}>エラー：{error}</p> : null}
    </div>
  );
}
