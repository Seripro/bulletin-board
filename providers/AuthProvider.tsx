"use client";

import {
  signInWithPassword,
  signOut,
  signUpWithPassword,
} from "@/utils/supabaseFunctions";
import { Session } from "@supabase/supabase-js";
import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  const value = {
    session,
    userId: session?.user.id ?? null,
    loading,
    signInWithPassword,
    signUpWithPassword,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
