"use client";

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  title: string;
  content: string;
};

export default function NewThreads() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const onSubmit = async (FormData: FormValues) => {
    console.log("登録完了");
    console.log("data: ", FormData);
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch("/api/threads/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(FormData), // user_id は送らない
      });
      const { message } = await res.json();
      console.log(message);
      if (message === "登録完了しました") {
        setLoading(false);
        router.push("/threads");
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) return <p>loading...</p>;

  return (
    <div>
      <p>new threads</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">タイトル: </label>
          <input
            type="text"
            id="title"
            {...register("title", {
              required: "タイトルは必須です",
              maxLength: {
                value: 30,
                message: "タイトルは30文字以内で入力してください",
              },
            })}
            placeholder="タイトルを入力してください"
          />
          {errors.title && (
            <p style={{ color: "red" }}>{errors.title.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="content">本文: </label>
          <input
            type="text"
            id="content"
            {...register("content", {
              required: "本文は必須です",
              maxLength: {
                value: 100,
                message: "本文は100文字以内で入力してください",
              },
            })}
            placeholder="本文を入力してください"
          />
          {errors.content && (
            <p style={{ color: "red" }}>{errors.content.message}</p>
          )}
        </div>
        <button type="submit">スレッドを作成する</button>
      </form>
    </div>
  );
}
