"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function deleteComment(commentId: string, threadId: string) {
  const supabase = await createClient();
  await supabase.from("comments").delete().eq("id", commentId);
  redirect(`/threads/${threadId}`);
}
