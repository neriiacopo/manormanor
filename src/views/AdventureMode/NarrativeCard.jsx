import { RuinedBox, PaperBox } from "../../fx";
import { Button } from "../../components";
import { resolveCardContent } from "../../lib/useNarrativeCard";
import styles from "./NarrativeCard.module.css";

/**
 * NarrativeCard — a single beat of the narrative deck (assets/demo/narrative),
 * matching the style-board reference: a gothic title, a torn parchment
 * scroll carrying the description (drop cap first letter), and the current
 * choice(s) below it.
 *
 * Purely presentational — background artwork, the drag/peek mechanics, and
 * card-to-card transitions all live one level up in CardStack. This also
 * doesn't walk `beats[]` progression, apply `outcomes`/`effects`, or follow
 * `force_next_draw` — see lib/useNarrativeCard's resolveCardContent for how
 * the different card shapes (choices/destinations/beats) get normalized.
 */
export default function NarrativeCard({ card, onChoose }) {
    if (!card) return null;

    const { title } = card;
    const { description, choices } = resolveCardContent(card);
    const firstLetter = description.charAt(0);
    const rest = description.slice(1);

    return (
        <div className={styles.frame}>
            <h1 className={styles.title}>{title}</h1>

            <RuinedBox
                roughness={20}
                frequency={0.015}
                octaves={4}
                seed={8}
                className={styles.panel}
            >
                <PaperBox
                    seed={14}
                    variation={1.1}
                    grain={0.9}
                    stains={0.4}
                    stainScale={2.4}
                    stainSoftness={0.1}
                    className={styles.paper}
                >
                    <p
                        className={styles.narrative}
                        style={{
                            marginBottom: choices.length > 0 ? "3rem" : 0,
                        }}
                    >
                        <span className={styles.dropcap}>{firstLetter}</span>
                        {rest}
                    </p>

                    {choices.length > 0 && (
                        <div className={styles.choices}>
                            {choices.map((choice) => (
                                <Button
                                    key={choice.id}
                                    onClick={() => onChoose?.(choice)}
                                >
                                    {choice.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </PaperBox>
            </RuinedBox>
        </div>
    );
}
