import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { ReactNode } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

let signUpWithPasswordMock: Mock<
  (email: string, password: string) => Promise<string | null>
> = vi.fn(async () => null);

vi.mock("@/providers/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => {
    const value = {
      session: null,
      userId: null,
      loading: false,
      signInWithPassword: vi.fn(),
      signUpWithPassword: signUpWithPasswordMock,
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
import Signup from "./page";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/providers/AuthProvider";

vi.mock("next/navigation");
const mockRouter = {
  push: vi.fn(),
} as unknown as ReturnType<typeof useRouter>;

describe("signup", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // 新しいモック関数で毎回リセット
    signUpWithPasswordMock = vi.fn(async () => null);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  it("タイトルがある", () => {
    render(
      <AuthProvider>
        <Signup />
      </AuthProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "新規登録" }),
    ).toBeInTheDocument();
  });

  it("メールアドレスとパスワードで新規登録ができる", () => {
    render(
      <AuthProvider>
        <Signup />
      </AuthProvider>,
    );

    const mailInput = screen.getByPlaceholderText("example@mail.com");
    const passInput = screen.getByPlaceholderText("8文字以上を推奨");
    fireEvent.change(mailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passInput, { target: { value: "123456" } });

    const button = screen.getByRole("button", { name: "新規登録" });
    fireEvent.click(button);

    expect(signUpWithPasswordMock).toHaveBeenCalledWith(
      "test@example.com",
      "123456",
    );
  });

  it("メールアドレスが入力されていないと新規登録できない", () => {
    render(
      <AuthProvider>
        <Signup />
      </AuthProvider>,
    );

    const passInput = screen.getByPlaceholderText("8文字以上を推奨");
    fireEvent.change(passInput, { target: { value: "123456" } });

    const button = screen.getByRole("button", { name: "新規登録" });
    fireEvent.click(button);

    expect(signUpWithPasswordMock).not.toHaveBeenCalled();
  });

  it("パスワードが入力されていないと新規登録できない", () => {
    render(
      <AuthProvider>
        <Signup />
      </AuthProvider>,
    );

    const mailInput = screen.getByPlaceholderText("example@mail.com");
    fireEvent.change(mailInput, { target: { value: "test@example.com" } });

    const button = screen.getByRole("button", { name: "新規登録" });
    fireEvent.click(button);

    expect(signUpWithPasswordMock).not.toHaveBeenCalled();
  });

  it("新規登録に失敗した場合、エラーメッセージが表示される", async () => {
    // このテストだけエラーを返すモックに差し替え
    signUpWithPasswordMock = vi.fn(async () => "新規登録に失敗しました");

    render(
      <AuthProvider>
        <Signup />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("8文字以上を推奨"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "新規登録" }));

    expect(
      await screen.findByText("新規登録に失敗しました"),
    ).toBeInTheDocument();
  });
  it("ログインページへのリンクがある", () => {
    render(
      <AuthProvider>
        <Signup />
      </AuthProvider>,
    );
    expect(screen.getByRole("link", { name: "ログインページはこちら" }));
  });
});
