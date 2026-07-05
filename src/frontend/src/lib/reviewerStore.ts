import type { Lane } from "@/data/projects";
import { type _SERVICE, idlFactory } from "@/declarations/backend.did";
import type { ReviewerView } from "@/lib/portfolioStrategy";
import { Actor, type ActorSubclass, HttpAgent } from "@icp-sdk/core/agent";
import env from "../../env.json";

let actorPromise: Promise<ActorSubclass<_SERVICE> | null> | null = null;
const lanes = [
  "Enablement",
  "AI Operations",
  "Learning Experience",
  "Technical Product",
  "Sales Enablement",
  "Compliance",
] satisfies Lane[];

function hasBackendConfig() {
  return (
    env.backend_canister_id &&
    env.backend_canister_id !== "undefined" &&
    env.backend_host &&
    env.backend_host !== "undefined"
  );
}

async function getActor() {
  if (!hasBackendConfig()) return null;

  actorPromise ??= Promise.resolve().then(() => {
    const agent = HttpAgent.createSync({ host: env.backend_host });
    return Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId: env.backend_canister_id,
    });
  });

  return actorPromise;
}

export async function loadPersistedReviewerView(
  slug: string,
): Promise<ReviewerView | null> {
  try {
    const actor = await getActor();
    if (!actor) return null;
    const result = await actor.getReviewerView(slug);
    const view = result[0];
    if (!view) return null;
    const viewLanes = view.lanes.filter((lane): lane is Lane =>
      lanes.includes(lane as Lane),
    );
    return {
      ...view,
      label: view.labelText,
      lanes: viewLanes.length > 0 ? viewLanes : ["Enablement" as Lane],
    };
  } catch (error) {
    console.warn("Reviewer path persistence unavailable", error);
    return null;
  }
}

export async function savePersistedReviewerView(view: ReviewerView) {
  try {
    const actor = await getActor();
    if (!actor) return false;
    await actor.saveReviewerView({
      ...view,
      labelText: view.label,
    });
    return true;
  } catch (error) {
    console.warn("Reviewer path persistence unavailable", error);
    return false;
  }
}
