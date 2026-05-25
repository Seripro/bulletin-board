import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "@/utils/supabase/server";
import RootPage from "./page";
import { redirect } from "next/navigation";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    redirect: vi.fn(),
  };
});
vi.mock("@/utils/supabase/server");

describe("RootPage redirect", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("user が存在する場合 /threads にリダイレクトする", async () => {
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "1" } } }),
      },
    } as unknown as Awaited<ReturnType<typeof createClient>>;
    vi.mocked(createClient).mockResolvedValue(mockClient);
    await RootPage();
    expect(redirect).toHaveBeenCalledWith("/threads");
  });

  it("user が null の場合 /login にリダイレクトする", async () => {
    const mockClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as unknown as Awaited<ReturnType<typeof createClient>>;
    vi.mocked(createClient).mockResolvedValue(mockClient);
    await RootPage();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
