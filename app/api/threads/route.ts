import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("threads").select("*");
  if (error) {
    throw error;
  } else {
    return NextResponse.json(data, { status: 200 });
  }
}
