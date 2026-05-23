import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ user_id: string }> },
) {
  const supabase = await createClient();
  const { user_id } = await params;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();
  if (error || !data) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}
