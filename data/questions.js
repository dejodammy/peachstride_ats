// questions.js
const questions = [
  {
    id: 1,
    question: "A client rejects your sales pitch. What’s the best way to respond?",
    options: [
      "Thank them, move on, and avoid wasting more time.",
      "Politely ask what didn’t work for them and use that insight to refine your pitch.",
      "Offer them a discount immediately to change their mind.",
      "Wait a few months before contacting them again with the same pitch."
    ],
    answer: "Politely ask what didn’t work for them and use that insight to refine your pitch."
  },
  {
    id: 2,
    question: "Your manager introduces a new CRM tool. You’ve never used it. What do you do?",
    options: [
      "Learn the basics yourself, try it on a small task, and ask for help when stuck.",
      "Rely on colleagues to enter your data.",
      "Avoid it until the manager insists.",
      "Stick to your old system since it already works."
    ],
    answer: "Learn the basics yourself, try it on a small task, and ask for help when stuck."
  },
  {
    id: 3,
    question: "You made a mistake during a presentation to a potential client. What’s the most professional step?",
    options: [
      "End the meeting early.",
      "Pretend it didn’t happen and keep going.",
      "Suggest the client misunderstood.",
      "Apologize briefly, correct the error, and follow up later with improved material."
    ],
    answer: "Apologize briefly, correct the error, and follow up later with improved material."
  },
  {
    id: 4,
    question: "A competitor launches a new product. What’s the best move?",
    options: [
      "Study the product, learn its strengths/weaknesses, and adjust your sales pitch accordingly",
      "Ignore it since your product is different.",
      "Spread negative rumors about it.",
      "Panic and lower your price immediately."
    ],
    answer: "Study the product, learn its strengths/weaknesses, and adjust your sales pitch accordingly"
  },
  {
    id: 5,
    question: "Your manager gives critical feedback about your sales approach. What do you do?",
    options: [
      "Ignore the advice.",
      "Defend yourself and argue your method works.",
      "Complain to colleagues.",
      "Accept it, ask clarifying questions, and apply the feedback."
    ],
    answer: "Accept it, ask clarifying questions, and apply the feedback."
  },
  {
    id: 6,
    question: "A customer complains that deliveries are often late. How do you handle it?",
    options: [
      "Suggest they adjust their expectations.",
      "Explain that delays are beyond your control.",
      "Promise unrealistic discounts.",
      "Apologize, investigate the cause, and assure them you’ll follow up."
    ],
    answer: "Apologize, investigate the cause, and assure them you’ll follow up."
  },
  {
    id: 7,
    question: "A long-term customer is considering switching to a competitor. What do you do?",
    options: [
      "Ask what the competitor offers and demonstrate how your product provides stronger value.",
      "Ignore the comment and continue your pitch.",
      "Demand loyalty since they’ve been with you for years.",
      "Immediately cut your price drastically."
    ],
    answer: "Ask what the competitor offers and demonstrate how your product provides stronger value."
  },
  {
    id: 8,
    question: "You forgot to call a customer back as promised. What should you do?",
    options: [
      "Call immediately, admit the delay, and provide the information",
      "Wait until they contact you again.",
      "Ignore it since it’s not urgent.",
      "Send a quick text explaination."
    ],
    answer: "Call immediately, admit the delay, and provide the information"
  },
  {
    id: 9,
    question: "A customer praises your service. What should you do?",
    options: [
      "Just say “thanks” and move on.",
      "Thank them and ask if they’d be open to referrals.",
      "Brag about it to your manager.",
      "Ignore the compliment."
    ],
    answer: "Thank them and ask if they’d be open to referrals."
  },
  {
    id: 10,
    question: "A new client says your competitor is cheaper. What’s your best approach?",
    options: [
      "Admit the competitor is cheaper and give up.",
      "Ask about their needs and explain how your solution provides greater long-term value.",
      "Immediately match their price without approval.",
      "Badmouth the competitor."
    ],
    answer: "Ask about their needs and explain how your solution provides greater long-term value."
  },
  {
    id: 11,
    question: "You’re behind on your monthly sales target. What do you do?",
    options: [
      "Prioritize high-potential leads, increase targeted outreach this week, and add extra follow-ups.",
      "Re-examine the pipeline, pull in warm prospects, run a short promotion for stuck deals, and ask teammates for tactics.",
      "Reassess your pipeline, prioritize promising leads, put in extra effort, and seek advice from teammates.",
      "All of the above."
    ],
    answer: "All of the above."
  },
  {
    id: 12,
    question: "You have multiple sales tasks competing for your time. How do you manage?",
    options: [
      "Tackle the easiest tasks first to build momentum.",
      "Use an urgency–impact matrix to prioritise, time-block the calendar, communicate deadlines, and escalate blockers early.",
      "Try to multitask across everything at once to “save” time.",
      "Wait for your manager to tell you what to do."
    ],
    answer: "Use an urgency–impact matrix to prioritise, time-block the calendar, communicate deadlines, and escalate blockers early."
  },
  {
    id: 13,
    question: "Your sales team is struggling to meet goals. What’s your best action?",
    options: [
      "Convene a short team huddle to diagnose causes, run focused coaching, agree on 2–3 experiments, and measure impact.",
      "Focus only on your individual numbers and avoid team conversations.",
      "Publicly call out underperformers to force accountability.",
      "None of the above."
    ],
    answer: "Convene a short team huddle to diagnose causes, run focused coaching, agree on 2–3 experiments, and measure impact."
  },
  {
    id: 14,
    question: "A very tough customer rejects you strongly. What’s the most effective next step?",
    options: [
      "Stay professional, review your approach, document feedback, and return later with a tailored, lower-risk proposal.",
      "Argue until they give in — stand your ground.",
      "Threaten to withdraw offers or escalate aggressively to pressure them.",
      "Quit and never return."
    ],
    answer: "Stay professional, review your approach, document feedback, and return later with a tailored, lower-risk proposal."
  },
  {
    id: 15,
    question: "You’re assigned a difficult project with ambitious goals. How do you approach it?",
    options: [
      "Hope for luck and act ad hoc as problems arise.",
      "Break the project into phases, create an action plan with milestones, secure resources and stakeholder buy-in, and review progress weekly.",
      "Delegate everything immediately and step back from coordination.",
      "Avoid the project and wait for reassignment."
    ],
    answer: "Break the project into phases, create an action plan with milestones, secure resources and stakeholder buy-in, and review progress weekly."
  },
  {
    id: 16,
    question: "A colleague disagrees with your sales approach. What do you do?",
    options: [
      "Insist your approach is right and implement it without discussion.",
      "Discuss both approaches, ask clarifying questions, test assumptions, and propose a combined plan to pilot.",
      "Escalate to the manager before talking to the colleague.",
      "Avoid working with them and do your own thing."
    ],
    answer: "Discuss both approaches, ask clarifying questions, test assumptions, and propose a combined plan to pilot."
  },
  {
    id: 17,
    question: "You’re given a large task that requires more than one person. How do you respond?",
    options: [
      "Attempt to complete it alone to control quality.",
      "Propose a shared plan, split responsibilities by strength, set checkpoints, and schedule brief syncs",
      "Complain about the workload and ask HR to intervene.",
      "Keep the plan to yourself and assign tasks without consultation."
    ],
    answer: "Propose a shared plan, split responsibilities by strength, set checkpoints, and schedule brief syncs"
  },
  {
    id: 18,
    question: "A teammate helps you secure a major client. What’s the best response?",
    options: [
      "Publicly acknowledge their role, record contributions in the CRM, and recommend them for recognition.",
      "Say thanks privately but don’t mention them publicly.",
      "Take full credit because you led the deal.",
      "Give a brief verbal thanks and leave it at that."
    ],
    answer: "Publicly acknowledge their role, record contributions in the CRM, and recommend them for recognition."
  },
  {
    id: 19,
    question: "You’re paired with someone you’ve clashed with before. What’s the most professional approach?",
    options: [
      "Rehash the past conflict at the first meeting to get it out in the open.",
      "Set clear mutual expectations, focus on shared goals, agree communication norms, and schedule an early alignment check-in.",
      "Refuse to work with them and ask for a new partner.",
      "Do your part separately and avoid coordination."
    ],
    answer: "Set clear mutual expectations, focus on shared goals, agree communication norms, and schedule an early alignment check-in."
  },
  {
    id: 20,
    question: "Your team achieves an important sales milestone. What’s the best action?",
    options: [
      "Celebrate the success, acknowledge contributions publicly, and capture lessons learned to scale the win.",
      "Highlight only your role and move on.",
      "Downplay the achievement to avoid attention.",
      "Report the milestone but omit individual contributors from recognition."
    ],
    answer: "Celebrate the success, acknowledge contributions publicly, and capture lessons learned to scale the win."
  }
];


export default questions;
