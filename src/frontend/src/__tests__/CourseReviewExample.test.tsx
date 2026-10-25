import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CourseReviewExample } from "../components/CourseReviewExample";
afterEach(cleanup);
it("explains the review using a labeled fictional example and accessible steps",()=>{
  render(<CourseReviewExample />);
  expect(screen.getByText(/Illustrative example using fictional/)).toBeVisible();
  expect(screen.getByRole("heading",{name:/learning goal and the lesson/})).toBeVisible();
  fireEvent.click(screen.getByRole("button",{name:"2. Investigate"}));
  expect(screen.getByRole("heading",{name:"Check the sources before requesting a change."})).toBeVisible();
  expect(screen.getByRole("button",{name:"2. Investigate"})).toHaveAttribute("aria-pressed","true");
  fireEvent.click(screen.getByRole("button",{name:"3. Resolve"}));
  expect(screen.getByRole("heading",{name:"Give the team a correction they can act on."})).toBeVisible();
});
