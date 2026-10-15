import { useRef, useState } from "react";
import type { ProjectSample } from "../content/project-samples";

export function ProjectDocumentViewer({ sample }: { sample: ProjectSample }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);
  const page = sample.pages[pageIndex];

  const goToPage = (index: number) => {
    setPageIndex(index);
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
      viewportRef.current.scrollLeft = 0;
    }
  };

  return (
    <section className="project-document" aria-labelledby="document-sample-title">
      <div className="project-document-heading">
        <div>
          <p className="text-sm font-bold text-cyan-100/80">Read the sample</p>
          <h2 id="document-sample-title">{sample.title}</h2>
        </div>
        <a className="project-live-link" href={sample.file} target="_blank" rel="noreferrer">
          Open original PDF
        </a>
      </div>
      {sample.note ? <p className="project-document-note">{sample.note}</p> : null}
      <div className="project-document-toolbar" role="group" aria-label="Document controls">
        <button className="admin-button" type="button" disabled={pageIndex === 0} onClick={() => goToPage(pageIndex - 1)}>
          Previous page
        </button>
        <label>
          Page
          <select aria-label="Document page" value={pageIndex} onChange={(event) => goToPage(Number(event.target.value))}>
            {sample.pages.map((_, index) => <option key={index} value={index}>{index + 1} of {sample.pages.length}</option>)}
          </select>
        </label>
        <button className="admin-button" type="button" disabled={pageIndex === sample.pages.length - 1} onClick={() => goToPage(pageIndex + 1)}>
          Next page
        </button>
        <label>
          Zoom
          <select aria-label="Document zoom" value={zoom} onChange={(event) => setZoom(Number(event.target.value))}>
            <option value={1}>Fit width</option>
            <option value={1.5}>150%</option>
            <option value={2}>200%</option>
            <option value={3}>300%</option>
          </select>
        </label>
      </div>
      <figure>
        <div className="project-document-viewport" ref={viewportRef} tabIndex={0} role="region" aria-label="Sample document page; scroll to read the full page">
          <img src={page.image} alt={`${sample.title}, page ${pageIndex + 1}. ${page.caption}`} style={{ width: `${zoom * 100}%` }} loading="lazy" />
        </div>
        <figcaption aria-live="polite">Page {pageIndex + 1} of {sample.pages.length}: {page.caption}</figcaption>
      </figure>
    </section>
  );
}
