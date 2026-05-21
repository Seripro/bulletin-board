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
    <div>
      <form className="auth-form" onSubmit={handleLogin}>
        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上を推奨"
            autoComplete="current-password"
            required
          />
        </label>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

        <button className="auth-button auth-button--primary" type="submit">
          ログイン
        </button>
      </form>
      <Link href="/signup">新規登録はこちら</Link>
    </div>
  );
};

export default Login;
