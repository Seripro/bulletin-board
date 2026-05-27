import { vi, describe, it, expect, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { deleteComment } from "./deleteComment";
import { waitFor } from "@testing-library/dom";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    redirect: vi.fn(),
  };
});
vi.mock("@/utils/supabase/server");
const mockClient = {
  from: vi.fn().mockReturnValue({
    delete: vi.fn().mockReturnValue({
      eq: vi.fn(),
    }),
  }),
} as unknown as Awaited<ReturnType<typeof createClient>>;
vi.mocked(createClient).mockResolvedValue(mockClient);

describe("delete comment", () => {
  it("削除時にリダイレクトする", async () => {
    deleteComment("1", "1");
    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/threads/1");
    });
  });
});
