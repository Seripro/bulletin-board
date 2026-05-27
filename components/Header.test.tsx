import { vi, describe, it, expect, beforeEach } from "vitest";
import { ReactNode } from "react";
import { AuthContext } from "../contexts/AuthContext";

const signOut = vi.fn(async () => {
  return;
});

vi.mock("@/providers/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => {
    const value = {
      session: null,
      userId: null,
      loading: false,
      signInWithPassword: vi.fn(),
      signUpWithPassword: vi.fn(),
      signOut: signOut,
    };
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  },
}));

vi.mock("next/navigation");
const mockRouter = {
  replace: vi.fn(),
} as unknown as ReturnType<typeof useRouter>;

vi.mock("next/navigation");
const mockPathname = "/threads";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Header } from "./Header";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider } from "@/providers/AuthProvider";

describe("Header", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(usePathname).mockReturnValue(mockPathname);
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>,
    );
  });

  it("スレッド一覧", () => {
    expect(
      screen.getByRole("link", { name: "スレッド一覧" }),
    ).toBeInTheDocument();
  });

  it("スレッド作成", () => {
    expect(
      screen.getByRole("link", { name: "スレッド作成" }),
    ).toBeInTheDocument();
  });

  it("Aboutページへのリンクがある", () => {
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("ログアウトができる", async () => {
    const button = screen.getByRole("button", { name: "ログアウト" });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/login");
    });
  });
});
