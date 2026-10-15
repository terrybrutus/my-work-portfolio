export type ProjectSample = {
  title: string;
  introduction: string;
  note?: string;
  file: string;
  pages: { image: string; caption: string }[];
  sections: { title: string; body: string }[];
};

export const projectSamples: Record<string, ProjectSample> = {
  "job-aid-template-system": {
    title: "Job aid template samples",
    introduction: "A job aid is a quick reference someone can use while doing a task. These examples organize software-purchasing guidance into definitions, requirements, and reference links so acquisition staff can find what they need. Acquisition means purchasing goods and services for an organization.",
    note: "This PDF includes a populated example and reusable layout templates. Boxes labeled Image Placeholder, QR CODE, and text placeholder are part of the template layouts. The regulatory references belong to the original sample.",
    file: "/assets/documents/job-aid-templates.pdf",
    pages: [
      { image: "/assets/documents/job-aid-templates-page-1.png", caption: "Populated example: definitions, critical requirements, and reference links for software acquisition." },
      { image: "/assets/documents/job-aid-templates-page-2.png", caption: "Two-page template, first page: software categories, implementation requirements, and spaces for supporting visuals." },
      { image: "/assets/documents/job-aid-templates-page-3.png", caption: "Two-page template, second page: license rights, implementation guidance, and support information." },
      { image: "/assets/documents/job-aid-templates-page-4.png", caption: "Alternative single-page layout: definitions, requirements, and implementation arranged in three columns." },
    ],
    sections: [
      { title: "What I Created", body: "A set of reference layouts for presenting dense acquisition information. The sample pairs a populated page with template variations that can be adapted for other topics." },
      { title: "How To Read It", body: "Start with the completed example on page 1, then compare the layouts on pages 2-4. Look at how headings, columns, resource links, and image spaces divide the information into sections a reader can scan." },
      { title: "What It Shows", body: "My approach to organizing technical information, establishing a visual hierarchy, and designing reusable support materials for people doing the work." },
    ],
  },
  "facilitator-guide-adaptation": {
    title: "Facilitator guide sample",
    introduction: "A facilitator guide is the instructor's plan for running a class. This five-page sample gives the instructor preparation steps, suggested wording, time allocations, activities, and checks for understanding. It shows how I planned a live session around content learners would also use on their devices.",
    note: "Course-specific terms have been redacted in this portfolio copy. The yellow-highlighted blanks mark those omissions. The teaching sequence, timing, instructor directions, and learner activities remain visible so you can review how the session was designed.",
    file: "/assets/documents/facilitator-guide.pdf",
    pages: [
      { image: "/assets/documents/facilitator-guide-page-1.png", caption: "Preparation: materials, equipment, room setup, a 24-hour checklist, and the opening activity." },
      { image: "/assets/documents/facilitator-guide-page-2.png", caption: "Opening instruction: learning objectives, recall prompts, and background information." },
      { image: "/assets/documents/facilitator-guide-page-3.png", caption: "Guided instruction and practice: reference readings, role-identification tasks, and facilitator prompts." },
      { image: "/assets/documents/facilitator-guide-page-4.png", caption: "Partner discussion, application, feedback, evaluation, and the transition to closure." },
      { image: "/assets/documents/facilitator-guide-page-5.png", caption: "Closing directions: final reference materials, learner feedback, and instructor follow-up." },
    ],
    sections: [
      { title: "What I Created", body: "A lesson plan that helps an instructor prepare for and lead a live session. It covers what to have ready, what to say, what learners should do, and when to move forward." },
      { title: "How The Session Works", body: "The guide moves from attention and objectives into explanation, practice, feedback, and evaluation. Gagne's Nine Events of Instruction provides the planning structure for that sequence." },
      { title: "What To Look For", body: "Notice the timed sections, directions tied to specific screens, partner activities, and reminders to check whether learners need help. These details make the plan usable by another instructor." },
    ],
  },
  "quality-assurance-review-system": {
    title: "Quality assurance review sample",
    introduction: "Quality assurance means checking a course before learners use it. This two-page excerpt shows my review notes for ACQ0130, a course about Urgent Capability Acquisition, a government purchasing process. Each row identifies a screen or shared issue and records the requested correction or question for the production team.",
    note: "This is an excerpt of a review log. The Change From, Change To, and Reviewer Notes columns show the issue, the requested fix, and the reasoning. Entries marked GLOBAL apply across multiple screens. These are review recommendations; the sample does not document whether every change was implemented.",
    file: "/assets/documents/qa-review-sample.pdf",
    pages: [
      { image: "/assets/documents/qa-review-sample-page-1.png", caption: "Review notes on navigation labels, course-menu consistency, missing popup instructions, and heading structure." },
      { image: "/assets/documents/qa-review-sample-page-2.png", caption: "Review notes on looping behavior, color contrast, text-and-graphic alignment, button positioning, and final-screen wording." },
    ],
    sections: [
      { title: "What I Created", body: "A structured record of course issues and requested changes that a designer, developer, or production team can work through screen by screen." },
      { title: "Examples In The Sample", body: "I flagged unclear Rewind and Forward controls, missing directions for closing popups, inconsistent headings, buttons that did not align with their characters, and text that did not match a graphic." },
      { title: "What It Shows", body: "The sample makes my review process visible: identifying a specific problem, explaining how it affects the learner, and giving the production team an actionable next step." },
    ],
  },
};
