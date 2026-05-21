"use client";

import { ThreadsType } from "@/types/threads";
import { UserType } from "@/types/user";
import { useEffect, useState } from "react";

const Threads = () => {
  const [threads, setThreads] = useState<ThreadsType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/threads", { cache: "no-store" });
        const threads: ThreadsType[] = await res.json();
        setThreads(threads);
        const userRes = await Promise.all(
          threads.map((thread) => fetch(`/api/users/${thread.user_id}`)),
        );
        const users: UserType[] = await Promise.all(
          userRes.map(async (res) => res.json()),
        );
        console.log(users);
        setUsers(users);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <p>Threads</p>
      {threads?.map((thread) => {
        const user = users.filter((user) => user.id === thread.user_id)[0];
        return (
          <div key={thread.id}>
            <p>{user?.name ?? "名無し"}</p>
            <p>{thread.title}</p>
            <p>{thread.content}</p>
            <p>{thread.created_at}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Threads;
