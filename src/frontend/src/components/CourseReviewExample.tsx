import { useState } from "react";

const stages = [
  { label: "1. Compare", heading: "The learning goal and the lesson do not match.", body: "The plan says staff will practice reporting a safety issue. The supplied lesson explains how to spot a hazard, but includes no reporting steps or practice.", evidence: "Learning goal: report an issue using the correct steps. Lesson: identifies hazards only." },
  { label: "2. Investigate", heading: "Check the sources before requesting a change.", body: "Confirm that the team has the right lesson version. Look for the missing content in the source materials, and check whether the goal points to a slide that actually exists.", evidence: "Question for the team: is the reporting section missing, in another file, or incorrectly mapped?" },
  { label: "3. Resolve", heading: "Give the team a correction they can act on.", body: "Ask for the correct reporting source, update the lesson-to-goal mapping, and add a short reporting scenario once the process has been confirmed. Keep the issue open until the source and lesson agree.", evidence: "Review note: reporting steps and practice are missing. Confirm the source before developing the activity." },
];

export function CourseReviewExample() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return <section className="course-review-example" aria-labelledby="review-example-heading">
    <p className="retro-tv-kicker">See how it works</p>
    <h2 id="review-example-heading">From a content mismatch to a clear next step</h2>
    <p className="review-example-note">Illustrative example using fictional workplace training. No client documents, internal messages, or restricted materials are shown.</p>
    <div className="review-example-steps" aria-label="Review process">
      {stages.map((item,index)=><button type="button" key={item.label} aria-pressed={active===index} onClick={()=>setActive(index)}>{item.label}</button>)}
    </div>
    <div className="review-example-content" aria-live="polite">
      <h3>{stage.heading}</h3><p>{stage.body}</p><blockquote>{stage.evidence}</blockquote>
    </div>
  </section>;
}
