import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App config={{ api: "a", productId: "test", shop: "kopasd" }} />);
  const linkElement = screen.getByText(/checklist/i);
  expect(linkElement).toBeInTheDocument();
});
