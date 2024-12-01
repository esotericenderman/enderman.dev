import { render, screen } from "@testing-library/react";
import App from "../../App/App";

test("renders 'interested in' text", () => {
  render(<App />);
  const linkElement = screen.getByText(/Interested in/);
  expect(linkElement).toBeInTheDocument();
});
