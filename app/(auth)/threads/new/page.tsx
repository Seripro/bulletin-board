"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

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
        body: JSON.stringify(FormData),
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

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">スレッド作成</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-lg border border-border bg-card p-6"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium"
          >
            タイトル
          </label>
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
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-danger">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="content"
            className="mb-1.5 block text-sm font-medium"
          >
            本文
          </label>
          <textarea
            id="content"
            rows={4}
            {...register("content", {
              required: "本文は必須です",
              maxLength: {
                value: 100,
                message: "本文は100文字以内で入力してください",
              },
            })}
            placeholder="本文を入力してください"
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-danger">
              {errors.content.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover cursor-pointer"
        >
          スレッドを作成する
        </button>
      </form>
    </div>
  );
}
