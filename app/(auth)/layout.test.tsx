import { AuthProvider } from "@/providers/AuthProvider";
import { render, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Layout from "./layout";
import { AuthContext } from "@/contexts/AuthContext";
import { ReactNode } from "react";
import { Session } from "@supabase/supabase-js";

vi.mock("next/navigation");
const mockRouter = {
  replace: vi.fn(),
} as unknown as ReturnType<typeof useRouter>;

vi.mock("@/providers/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => {
    const value = {
      session: null,
      userId: null,
      loading: false,
      signInWithPassword: vi.fn(),
      signUpWithPassword: vi.fn(),
      signOut: vi.fn(),
    };
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  },
}));

vi.mock("@/components/Header", () => ({
  Header: () => <div>ヘッダー</div>,
}));

describe("auth layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  it("ログインしていないと /login に飛ばされる", () => {
    render(
      <AuthProvider>
        <Layout>
          <button />
        </Layout>
      </AuthProvider>,
    );
    expect(mockRouter.replace).toHaveBeenCalledWith("/login");
  });

  it("ログインしているとリダイレクトされない", async () => {
    const value = {
      session: { user: { id: "user1" } } as Session,
      userId: "user1",
      loading: false,
      signInWithPassword: vi.fn(),
      signUpWithPassword: vi.fn(),
      signOut: vi.fn(),
    };
    render(
      <AuthContext.Provider value={value}>
        <Layout>
          <button />
        </Layout>
      </AuthContext.Provider>,
    );

    await waitFor(() => {
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });
});
