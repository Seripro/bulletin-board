import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const signInWithPassword = async (
  email: string,
  password: string,
): Promise<string | null> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
};

export const signUpWithPassword = async (
  email: string,
  password: string,
): Promise<string | null> => {
  const { error } = await supabase.auth.signUp({ email, password });
  return error ? error.message : null;
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};
