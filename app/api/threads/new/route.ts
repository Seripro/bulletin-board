import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const auth = request.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { data: userData, error: userError } =
    await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await request.json();
  const { data, error } = await supabase.from("threads").insert({
    title,
    content,
    user_id: userData.user.id,
  });
  if (error) {
    throw error;
  } else {
    return NextResponse.json({
      message: "登録完了しました",
      data: data,
    });
  }
}
