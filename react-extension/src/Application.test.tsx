import { render, screen } from "@testing-library/react";
import Application from "./Application";

test("renders learn react link", () => {
  render(
    <Application config={{ api: "a", productId: "test", shop: "kopasd" }} />
  );
  const linkElement = screen.getByText(/checklist/i);
  expect(linkElement).toBeInTheDocument();
});
