import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { ReactNode } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

let signInWithPasswordMock: Mock<
  (email: string, password: string) => Promise<string | null>
> = vi.fn(async () => null);

vi.mock("@/providers/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => {
    const value = {
      session: null,
      userId: null,
      loading: false,
      signInWithPassword: signInWithPasswordMock,
      signUpWithPassword: vi.fn(),
      signOut: vi.fn(async () => {
        return;
      }),
    };
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  },
}));

import { fireEvent, render, screen } from "@testing-library/react";
import Login from "./page";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/providers/AuthProvider";

vi.mock("next/navigation");
const mockRouter = {
  push: vi.fn(),
} as unknown as ReturnType<typeof useRouter>;

describe("login", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // 新しいモック関数で毎回リセット
    signInWithPasswordMock = vi.fn(async () => null);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  it("タイトルがある", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );
    expect(screen.getByRole("heading", { name: "ログイン" })).toBeTruthy();
  });

  it("メールアドレスとパスワードでログインができる", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    const mailInput = screen.getByPlaceholderText("example@mail.com");
    const passInput = screen.getByPlaceholderText("8文字以上を推奨");
    fireEvent.change(mailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passInput, { target: { value: "123456" } });

    const button = screen.getByRole("button", { name: "ログイン" });
    fireEvent.click(button);

    expect(signInWithPasswordMock).toHaveBeenCalledWith(
      "test@example.com",
      "123456",
    );
  });

  it("メールアドレスが入力されていないとログインできない", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    const passInput = screen.getByPlaceholderText("8文字以上を推奨");
    fireEvent.change(passInput, { target: { value: "123456" } });

    const button = screen.getByRole("button", { name: "ログイン" });
    fireEvent.click(button);

    expect(signInWithPasswordMock).not.toHaveBeenCalled();
  });

  it("パスワードが入力されていないとログインできない", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    const mailInput = screen.getByPlaceholderText("example@mail.com");
    fireEvent.change(mailInput, { target: { value: "test@example.com" } });

    const button = screen.getByRole("button", { name: "ログイン" });
    fireEvent.click(button);

    expect(signInWithPasswordMock).not.toHaveBeenCalled();
  });

  it("ログインに失敗した場合、エラーメッセージが表示される", async () => {
    // このテストだけエラーを返すモックに差し替え
    signInWithPasswordMock = vi.fn(async () => "ログインに失敗しました");

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("8文字以上を推奨"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ログイン" }));

    expect(
      await screen.findByText("ログインに失敗しました"),
    ).toBeInTheDocument();
  });
  it("新規登録ページへのリンクがある", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );
    expect(screen.getByRole("link", { name: "新規登録はこちら" }));
  });
});
