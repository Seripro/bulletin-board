import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Home Page", () => {
  it("タイトルが表示される", async () => {
    render(<Page />);

    expect(
      await screen.findByText("To get started, edit the page.tsx file."),
    ).toBeInTheDocument();
  });
});
