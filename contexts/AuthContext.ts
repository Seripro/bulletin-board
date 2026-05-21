"use client";

import { Session } from "@supabase/supabase-js";
import { createContext } from "react";

type ValueType = {
  session: Session | null;
  userId: string | null;
  loading: boolean;
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<string | null>;
  signUpWithPassword: (
    email: string,
    password: string,
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<ValueType | null>(null);
