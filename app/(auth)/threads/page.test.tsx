import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Threads from "./page";
import { createClient } from "@/utils/supabase/server";

vi.mock("@/utils/supabase/server");

const mockSupabase = {
  from: vi.fn((table: string) => {
    if (table === "threads") {
      return {
        select: vi.fn().mockResolvedValue({
          data: [
            {
              content: "よろしく",
              created_at: "2026-05-22 00:14:34.126649+00",
              id: "2af684b5-4860-4587-b038-189ec9492a79",
              title: "タイトルなしだよー",
              updated_at: "2026-05-22 00:14:34.126649+00",
              user_id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
            },
          ],
          error: null,
        }),
      };
    }

    if (table === "profiles") {
      return {
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [
              {
                id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
                name: "テストユーザー",
              },
            ],
            error: null,
          }),
        }),
      };
    }

    return {};
  }),
} as unknown as Awaited<ReturnType<typeof createClient>>;

const mockSupabaseForNull = {
  from: vi.fn((table: string) => {
    if (table === "threads") {
      return {
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };
    }

    if (table === "profiles") {
      return {
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: [
              {
                id: "36659a60-d216-4373-9a8b-4fa6b9dd785b",
                name: "テストユーザー",
              },
            ],
            error: null,
          }),
        }),
      };
    }

    return {};
  }),
} as unknown as Awaited<ReturnType<typeof createClient>>;

describe("threads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
  });

  it("タイトルが表示されている", async () => {
    const ui = await Threads();
    render(ui);

    expect(
      screen.getByRole("heading", { name: "スレッド一覧" }),
    ).toBeInTheDocument();
  });

  it("スレッドのタイトルが表示されている", async () => {
    const ui = await Threads();
    render(ui);

    expect(screen.getByText("タイトルなしだよー")).toBeInTheDocument();
  });

  it("スレッドがない場合、メッセージが表示されている", async () => {
    vi.mocked(createClient).mockResolvedValue(mockSupabaseForNull);
    const ui = await Threads();
    render(ui);
    expect(screen.getByText("スレッドがまだありません。")).toBeInTheDocument();
  });
});
