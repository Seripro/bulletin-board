"use client";

import { supabase } from "@/utils/supabase";
import {
  signInWithPassword,
  signOut,
  signUpWithPassword,
} from "@/utils/supabaseFunctions";
import { Session } from "@supabase/supabase-js";
import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (e) {
        console.log(e);
      }
    };
    fetchSession();
  });
  const value = {
    session,
    userId: session?.user.id ?? null,
    signInWithPassword,
    signUpWithPassword,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
