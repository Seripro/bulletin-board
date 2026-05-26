import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";
import ThreadsDetail from "./page";

let commentsMockData = [
  {
    id: "0d0207f8-aaf4-4f93-b487-21cdda2e31a1",
    created_at: "2026-05-22 00:14:34.126649+00",
    thread_id: "353c44ef-c7a6-4eea-8a70-b672e5e6386c",
    user_id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
    content: "よろしく",
  },
  {
    id: "0d0207f8-aaf4-4f93-b487-21cdda2e31a1",
    created_at: "2026-05-22 00:14:34.126649+00",
    thread_id: "353c44ef-c7a6-4eea-8a70-b672e5e6386c",
    user_id: "123",
    content: "ユーザー123です",
  },
];

vi.mock("@/utils/supabase/server");
vi.mock("./CommentForm", () => ({
  default: () => {
    const handleClick = () => {
      commentsMockData = [
        {
          id: "0d0207f8-aaf4-4f93-b487-21cdda2e31a1",
          created_at: "2026-05-22 00:14:34.126649+00",
          thread_id: "353c44ef-c7a6-4eea-8a70-b672e5e6386c",
          user_id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
          content: "よろしく",
        },
        {
          id: "0d0207f8-aaf4-4f93-b487-21cdda2e31a1",
          created_at: "2026-05-22 00:14:34.126649+00",
          thread_id: "353c44ef-c7a6-4eea-8a70-b672e5e6386c",
          user_id: "123",
          content: "ユーザー123です",
        },
        {
          id: "0d0207f8-aaf4-4f93-b487-21cdda2e31a1",
          created_at: "2026-05-22 00:14:34.126649+00",
          thread_id: "353c44ef-c7a6-4eea-8a70-b672e5e6386c",
          user_id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
          content: "よろしくパート2",
        },
      ];
    };
    return (
      <div>
        <input placeholder="コメントを入力" />
        <button onClick={handleClick}>送信</button>
      </div>
    );
  },
}));

const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: "36659a60-d216-4373-9a8b-4fa6b9dd785b" } },
    }),
  },
  from: vi.fn((table: string) => {
    if (table === "threads") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                content: "よろしく",
                created_at: "2026-05-22 00:14:34.126649+00",
                id: "353c44ef-c7a6-4eea-8a70-b672e5e6386c",
                title: "タイトルなしだよー",
                updated_at: "2026-05-22 00:14:34.126649+00",
                user_id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
              },
              error: null,
            }),
          }),
        }),
      };
    }

    if (table === "comments") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: commentsMockData,
            error: null,
          }),
        }),
      };
    }

    if (table === "profiles") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                avatar_url: null,
                created_at: "2026-05-22 00:14:34.126649+00",
                id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
                name: "テストユーザー",
              },
              error: null,
            }),
          }),
        }),
      };
    }

    return {};
  }),
} as unknown as Awaited<ReturnType<typeof createClient>>;

describe("threads detail", () => {
  beforeEach(async () => {
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
    commentsMockData = [
      {
        id: "0d0207f8-aaf4-4f93-b487-21cdda2e31a1",
        created_at: "2026-05-22 00:14:34.126649+00",
        thread_id: "353c44ef-c7a6-4eea-8a70-b672e5e6386c",
        user_id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
        content: "よろしく",
      },
      {
        id: "0d0207f8-aaf4-4f93-b487-21cdda2e31a1",
        created_at: "2026-05-22 00:14:34.126649+00",
        thread_id: "353c44ef-c7a6-4eea-8a70-b672e5e6386c",
        user_id: "123",
        content: "ユーザー123です",
      },
    ];
    const ui = await ThreadsDetail({ params: { id: "1" } });
    render(ui);
  });
  it("タイトルが表示されている", () => {
    expect(screen.getByRole("heading", { name: "タイトルなしだよー" }));
  });
  it("スレッドを立てた日付が表示されている", () => {
    expect(screen.getByText("2026年5月22日"));
  });
  it("コメントが二つ表示されている", () => {
    expect(screen.getByText("コメント (2)"));
  });
  it("コメントを追加すると表示される", async () => {
    const input = screen.getByPlaceholderText("コメントを入力");
    fireEvent.change(input, { target: { value: "コメント" } });

    const button = screen.getByText("送信");
    fireEvent.click(button);

    const ui2 = await ThreadsDetail({ params: { id: "1" } });
    render(ui2);

    expect(await screen.findByText("よろしくパート2"));
    expect(screen.getByText("コメント (3)"));
  });
  it("自分のコメント以外には削除ボタンが表示されていない", () => {
    screen.debug();
    const buttons = screen.getAllByText("削除");
    expect(buttons.length).toBe(1);
  });
});
