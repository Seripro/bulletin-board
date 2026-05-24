"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

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
      router.refresh();
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-6">
        <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="コメントを入力..."
          rows={2}
          className="flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="self-end rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover cursor-pointer"
        >
          送信
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-sm text-danger">{error}</p>
      ) : null}
    </div>
  );
}
