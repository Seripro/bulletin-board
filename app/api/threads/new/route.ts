import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  const { data, error } = await supabase.from("threads").insert(body);
  if (error) {
    throw error;
  } else {
    return NextResponse.json({
      message: "登録完了しました",
      data: data,
    });
  }
}
