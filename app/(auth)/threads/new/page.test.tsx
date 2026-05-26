import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import NewThreads from "./page";

vi.mock("@/utils/supabase/client");
const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: {
          access_token: "アクセストークン",
        },
      },
    }),
  },
} as unknown as Awaited<ReturnType<typeof createClient>>;

vi.mock("next/navigation");
const mockRouter = {
  push: vi.fn(),
} as unknown as ReturnType<typeof useRouter>;

describe("new threads", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReturnValue(mockSupabase);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.spyOn(global, "fetch").mockImplementation(
      async () =>
        new Response('{ "message": "登録完了しました" }', { status: 200 }),
    );
    render(<NewThreads />);
  });
  it("タイトルが表示されている", async () => {
    expect(screen.getByRole("heading", { name: "スレッド作成" }));
  });
  it("新しいスレッドを作成すると /threads に遷移する", async () => {
    const title = screen.getByPlaceholderText("タイトルを入力してください");
    const content = screen.getByPlaceholderText("本文を入力してください");
    fireEvent.change(title, { target: { value: "タイトルA" } });
    fireEvent.change(content, { target: { value: "こんにちは" } });

    const button = screen.getByRole("button", { name: "スレッドを作成する" });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/threads");
    });
  });
  describe("validation check", () => {
    it("タイトルを入力しないとエラーメッセージが出る", async () => {
      const content = screen.getByPlaceholderText("本文を入力してください");
      fireEvent.change(content, { target: { value: "こんにちは" } });
      const button = screen.getByRole("button", { name: "スレッドを作成する" });
      fireEvent.click(button);

      const error = await screen.findByText("タイトルは必須です");
      expect(error).toBeInTheDocument();
    });
    it("本文を入力しないとエラーメッセージが出る", async () => {
      const content = screen.getByPlaceholderText("タイトルを入力してください");
      fireEvent.change(content, { target: { value: "タイトルA" } });
      const button = screen.getByRole("button", { name: "スレッドを作成する" });
      fireEvent.click(button);

      const error = await screen.findByText("本文は必須です");
      expect(error).toBeInTheDocument();
    });
    it("タイトルが30文字以内でないとエラーメッセージが出る", async () => {
      const content = screen.getByPlaceholderText("タイトルを入力してください");
      fireEvent.change(content, {
        target: {
          value:
            "タイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルA",
        },
      });
      const button = screen.getByRole("button", { name: "スレッドを作成する" });
      fireEvent.click(button);

      const error = await screen.findByText(
        "タイトルは30文字以内で入力してください",
      );
      expect(error).toBeInTheDocument();
    });
    it("本文が100文字以内でないとエラーメッセージが出る", async () => {
      const content = screen.getByPlaceholderText("本文を入力してください");
      fireEvent.change(content, {
        target: {
          value:
            "タイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタイトルAタ",
        },
      });
      const button = screen.getByRole("button", { name: "スレッドを作成する" });
      fireEvent.click(button);

      const error = await screen.findByText(
        "本文は100文字以内で入力してください",
      );
      expect(error).toBeInTheDocument();
    });
  });
});
