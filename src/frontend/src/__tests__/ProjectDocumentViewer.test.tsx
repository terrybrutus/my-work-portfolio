import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProjectDocumentViewer } from "../components/ProjectDocumentViewer";
import { projectSamples } from "../content/project-samples";

afterEach(cleanup);

describe("portfolio document samples", () => {
  it("shows both QA pages with working page navigation and zoom", () => {
    render(<ProjectDocumentViewer sample={projectSamples["quality-assurance-review-system"]} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/assets/documents/qa-review-sample-page-1.png");
    expect(screen.getByRole("button", {name: "Previous page"})).toBeDisabled();
    fireEvent.click(screen.getByRole("button", {name: "Next page"}));
    expect(screen.getByRole("img")).toHaveAttribute("src", "/assets/documents/qa-review-sample-page-2.png");
    expect(screen.getByRole("button", {name: "Next page"})).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Document zoom"), {target: {value: "2"}});
    expect(screen.getByRole("img")).toHaveStyle({width: "200%"});
    fireEvent.change(screen.getByLabelText("Document page"), {target: {value: "0"}});
    expect(screen.getByRole("img")).toHaveAttribute("src", "/assets/documents/qa-review-sample-page-1.png");
  });

  it("explains the facilitator redactions and links to the intact PDF", () => {
    render(<ProjectDocumentViewer sample={projectSamples["facilitator-guide-adaptation"]} />);
    expect(screen.getByText(/yellow-highlighted blanks/i)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Open original PDF"})).toHaveAttribute("href", "/assets/documents/facilitator-guide.pdf");
    expect(screen.getByLabelText("Document page").querySelectorAll("option")).toHaveLength(5);
  });

  it("labels the job aid template placeholders and exposes all four pages", () => {
    render(<ProjectDocumentViewer sample={projectSamples["job-aid-template-system"]} />);
    expect(screen.getByText(/populated example and reusable layout templates/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Document page"), {target: {value: "3"}});
    expect(screen.getByRole("img")).toHaveAttribute("src", "/assets/documents/job-aid-templates-page-4.png");
  });
});
