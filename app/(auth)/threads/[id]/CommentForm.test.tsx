import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import CommentForm from "./CommentForm";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

vi.mock("@/utils/supabase/client");
const mockSupabase = {
  from: vi.fn().mockReturnValue({
    insert: vi.fn(),
  }),
} as unknown as ReturnType<typeof createClient>;

vi.mock("next/navigation");
const mockRouter = {
  refresh: vi.fn(),
} as unknown as ReturnType<typeof useRouter>;

describe("Comment Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockReturnValue(mockSupabase);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    render(<CommentForm threadId="1" />);
  });
  it("送信ボタンがある", () => {
    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });
  it("コメントを追加できる", async () => {
    const input = screen.getByPlaceholderText("コメントを入力...");
    fireEvent.change(input, { target: { value: "コメント" } });
    const button = screen.getByRole("button", { name: "送信" });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
  it("コメントを入力しないと送信できない", async () => {
    const button = screen.getByRole("button", { name: "送信" });
    fireEvent.click(button);
    expect(
      await screen.findByText("コメントを入力してください"),
    ).toBeInTheDocument();
  });
});
