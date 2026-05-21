"use client";

import { useAuth } from "@/hooks/useAuth";
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
  const { userId } = useAuth();
  const onSubmit = async (data: FormValues) => {
    console.log("登録完了");
    console.log("data: ", data);
    try {
      await fetch("/api/threads/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, user_id: userId }),
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <p>new threads</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">タイトル: </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "タイトルは必須です" })}
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
            {...register("content", { required: "本文は必須です" })}
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
