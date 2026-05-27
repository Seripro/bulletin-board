import { screen, render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import ThreadCard from "./ThreadCard";

const mockThread = {
  content: "これはテスト用の本文です",
  created_at: "2026-05-27T12:00:00.000Z",
  id: "thread-1",
  title: "テスト用スレッド",
  updated_at: "2026-05-27T12:00:00.000Z",
  user_id: "user-1",
};

const mockUser = {
  avatar_url: null,
  created_at: "2026-05-27T12:00:00.000Z",
  id: "user-1",
  name: "テストユーザー",
};

describe("Thread Card", () => {
  beforeEach(() => {
    render(<ThreadCard thread={mockThread} user={mockUser} />);
  });
  it("リンクがある", () => {
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("タイトルが表示されている", () => {
    expect(screen.getByText("テスト用スレッド")).toBeInTheDocument();
  });

  it("本文が表示されている", () => {
    expect(screen.getByText("これはテスト用の本文です")).toBeInTheDocument();
  });

  it("名前が表示されている", () => {
    expect(screen.getByText("テストユーザー")).toBeInTheDocument();
  });

  it("日付が表示されている", () => {
    expect(screen.getByText("2026/5/27")).toBeInTheDocument();
  });
});
