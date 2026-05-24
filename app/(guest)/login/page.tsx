"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const Login = () => {
  const { signInWithPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) {
      try {
        const error = await signInWithPassword(email, password);
        if (error) {
          setErrorMessage(error);
        } else {
          router.push("/");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      setErrorMessage("メールアドレス、パスワードを入力してください");
    }
  };
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h1 className="mb-6 text-center text-xl font-bold">ログイン</h1>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            autoComplete="email"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上を推奨"
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {errorMessage ? (
          <p className="text-sm text-danger">{errorMessage}</p>
        ) : null}

        <button
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover cursor-pointer"
          type="submit"
        >
          ログイン
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        <Link
          href="/signup"
          className="text-primary hover:underline"
        >
          新規登録はこちら
        </Link>
      </p>
    </div>
  );
};

export default Login;
