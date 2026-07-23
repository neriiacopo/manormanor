import { useMemo } from "react";

// The demo narrative deck (assets/demo/narrative) is a flat folder of card
// JSON files, one per encounter/event/intro, plus an images/ subfolder of
// matching artwork:
//
//   entry_hall_intro_departure_01.json   { id: "entry_hall_intro_departure_01", ... }
//   images/entry_hall_intro_departure_01.png
//
// The convention is: artwork for a card always lives at
// `images/<card.id>.png`. Some cards (e.g. events) also spell this out
// explicitly via `visual.image` — but that path is always exactly
// `images/<id>.png`, so it's redundant with the id itself. Intro/departure
// cards like entry_hall_intro_departure_01 skip `visual.image` entirely
// even though the artwork file exists, which is why we resolve by id
// rather than trusting `visual.image` to always be present.
//
// Card shape (see the JSON files for the full picture):
//   id, class ("BiomeIntro" | "Event" | "Combat" | "Transition"), subtype,
//   title, description, visual: { image?, alt_text }, properties,
//   draw_mode, force_next_draw,
//   and EITHER a flat `choices[]` (single-beat cards, e.g. BiomeIntro) OR a
//   `beats[]` array of { id, description, choices[] } for multi-step
//   Events. Each choice has resource_tests/resource_cost/outcomes.success/
//   outcomes.failure, each outcome carrying narrative/effects/next_beat/
//   force_next_draw. That branching (beats, resource tests, effects) isn't
//   wired up yet — this hook only resolves a card's data + artwork.
const cardModules = import.meta.glob("../assets/demo/narrative/*.json", {
    eager: true,
    import: "default",
});
const imageModules = import.meta.glob("../assets/demo/narrative/images/*.png", {
    eager: true,
    import: "default",
});

const CARDS = Object.fromEntries(
    Object.values(cardModules).map((card) => [card.id, card]),
);

function resolveImage(id) {
    const path = `../assets/demo/narrative/images/${id}.png`;
    return imageModules[path] ?? null;
}

/** All card ids available in the demo narrative deck. */
export function listNarrativeCards() {
    return Object.keys(CARDS);
}

/**
 * useNarrativeCard("entry_hall_intro_departure_01") — resolves a card's
 * JSON data plus its artwork URL (or null if no matching image), memoized
 * per id. Returns null if the id doesn't match any card.
 */
export function useNarrativeCard(id) {
    return useMemo(() => {
        const card = CARDS[id];
        if (!card) return null;
        return { card, image: resolveImage(id) };
    }, [id]);
}

/**
 * Normalizes the three card shapes into one { description, choices } the UI
 * can render without caring which class the card is:
 *  - BiomeIntro (and similar): flat `description` + `choices[]`.
 *  - Transition: flat `description` + `destinations[]` (label + target_biome,
 *    no id/no outcomes) — mapped to choice-shaped objects.
 *  - Event: `beats[]`, each with its own `description` + `choices[]`. Beat
 *    progression/outcomes/effects aren't wired up yet, so this only surfaces
 *    the opening beat (`beats[0]`) as a stand-in.
 */
export function resolveCardContent(card) {
    if (!card) return { description: "", choices: [] };

    if (Array.isArray(card.beats) && card.beats.length > 0) {
        const [firstBeat] = card.beats;
        return {
            description: firstBeat.description ?? card.description ?? "",
            choices: firstBeat.choices ?? [],
        };
    }

    if (Array.isArray(card.destinations) && card.destinations.length > 0) {
        return {
            description: card.description ?? "",
            choices: card.destinations.map((destination, i) => ({
                id: destination.target_biome ?? `destination_${i}`,
                label: destination.label,
            })),
        };
    }

    return {
        description: card.description ?? "",
        choices: card.choices ?? [],
    };
}

export default useNarrativeCard;
