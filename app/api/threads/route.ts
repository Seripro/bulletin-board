import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("threads").select("*");
  if (error) {
    throw error;
  } else {
    return NextResponse.json(data, { status: 200 });
  }
}
