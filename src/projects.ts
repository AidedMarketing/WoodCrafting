import { stages as mushroomStages } from "./lesson";
export type ProjectId = "mushroom" | "egg";
export type LessonStep = (typeof mushroomStages)[number];
const eggStages: LessonStep[] = [
  {
    title: "Choose your practice block",
    short: "Start here",
    skill: "Preparation",
    summary: "Learn to see a curve inside a block.",
    action:
      "Use clear basswood about 1½ × 1½ × 2½ inches (38 × 38 × 64 mm). Mark the top, bottom, and middle. The long grain runs between the ends.",
    details: [
      "Read Before you carve and prepare a secure work support. Practice a small shaving on scrap first.",
      "Draw a simple egg outline on two adjacent faces: broad below the middle, narrower toward the top.",
      "Keep pencil marks as references. You will repeatedly rotate the block to compare both outlines.",
    ],
    check:
      "The grain runs lengthwise, the blank has no cracks or knots, and your outlines agree.",
    safety:
      "Secure the wood and keep both hands behind the cutting edge. Put the knife down before checking the screen.",
    look: "Practice blank · lengthwise grain",
    change: "The original basswood blank.",
  },
  {
    title: "Remove the long corners",
    short: "Soften corners",
    skill: "Small shavings",
    summary: "Eight faces are easier to round than four.",
    action:
      "Shave a little from each long corner. Rotate the block after a few light cuts and keep the new faces similar in width.",
    details: [
      "Use short, shallow cuts that release without force.",
      "Keep the ends full for now. Work only on the four long corners.",
      "Stop and reposition whenever a blade could travel toward a hand or your body.",
    ],
    check: "There are eight long faces, with no deep cuts or splits.",
    safety:
      "If fibers lift ahead of the edge, stop. Reverse the wood’s orientation and try a smaller shaving.",
    look: "Eight-sided practice blank",
    change: "Four long corners are removed.",
  },
  {
    title: "Find the oval",
    short: "Shape the oval",
    skill: "Grain awareness",
    summary: "Leave a generous shape to refine.",
    action:
      "First shave the long ridges toward a rounded blank. Then gradually soften both ends, keeping the middle wide.",
    details: [
      "Remove tiny shavings around the shoulders rather than slicing across an entire end.",
      "Compare the two pencil outlines as you rotate. Keep extra wood at the narrower top.",
      "Check the side and top views. Aim for a broad, slightly squared oval before refining it.",
    ],
    check:
      "The square corners have gone, both ends are rounded, and there is still room to refine the outline.",
    safety:
      "End grain can resist the blade. Never solve that by pushing harder; reduce the shaving size and check your edge.",
    look: "Rounded oval · extra wood at both ends",
    change: "The long ridges and end corners are removed.",
  },
  {
    title: "Refine the egg",
    short: "Refine the curve",
    skill: "Light finishing cuts",
    summary: "A continuous curve, made a little at a time.",
    action:
      "Use tiny shavings to blend the shoulders into a full lower end and a gently tapered upper end. Keep the small facets that feel good in your hand.",
    details: [
      "Rotate and check the silhouette after every few cuts. A handmade egg need not be perfectly symmetrical.",
      "If a ridge remains, remove only that high spot. Avoid chasing the model with deep cuts.",
      "Sheathe your knife, inspect for loose splinters, and keep the practice piece as a reference for your next project.",
    ],
    check:
      "The outline flows from a broad lower end to a narrower top, with no loose splinters.",
    safety:
      "An egg can roll. Reposition and secure the work as it becomes rounded; never carve a loose piece on the bench.",
    look: "Finished practice egg",
    change: "Small remaining high spots are removed.",
  },
];
export const projects = {
  egg: {
    id: "egg" as const,
    title: "The practice egg",
    name: "practice egg",
    tag: "FOUNDATION / BEGINNER",
    description:
      "Learn small cuts, grain direction, and how flat faces become a curve.",
    stages: eggStages,
    dimension: "64 mm",
    recommended: "Start with the fundamentals",
  },
  mushroom: {
    id: "mushroom" as const,
    title: "Your first mushroom",
    name: "mushroom",
    tag: "FIRST PROJECT / BEGINNER",
    description:
      "Bring a cap and stem out of a blank. Practice stop cuts and controlled shaping.",
    stages: mushroomStages,
    dimension: "64 mm",
    recommended: "Make your first little sculpture",
  },
};
