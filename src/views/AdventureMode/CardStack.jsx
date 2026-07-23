import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNarrativeCard } from "../../lib/useNarrativeCard";
import DraggableCard from "./DraggableCard";
import NarrativeCard from "./NarrativeCard";
import styles from "./CardStack.module.css";

/**
 * CardStack — walks a fixed sequence of narrative card ids, one at a time:
 *  - a shared background layer crossfades between artwork through a solid
 *    black backdrop (`mode="wait"` on AnimatePresence means the outgoing
 *    image fully fades out — revealing the black backdrop underneath —
 *    before the incoming one fades in, rather than a direct crossfade);
 *  - the card itself (title/text/choices, wrapped in DraggableCard for the
 *    drag-to-reveal/lock behavior) slides up and out when a choice is
 *    picked, and the next one spawns peeking up from the bottom.
 *
 * TODO(cowork): `sequence` is a hardcoded demo list. A real implementation
 * would resolve the next card from the picked choice's
 * `outcomes.success/failure` + `force_next_draw` (and, for Event cards,
 * walk `beats[]` before moving to the next card) rather than just
 * advancing an index.
 */
export default function CardStack({ sequence }) {
    const [index, setIndex] = useState(0);
    const cardId = sequence[Math.min(index, sequence.length - 1)];
    const resolved = useNarrativeCard(cardId);

    const handleChoose = () => {
        setIndex((i) => Math.min(i + 1, sequence.length - 1));
    };

    if (!resolved) {
        return <div className={styles.stage} />;
    }

    const { card, image } = resolved;

    return (
        <div className={styles.stage}>
            <div
                className={styles.backdrop}
                aria-hidden="true"
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={cardId}
                    className={styles.background}
                    style={image ? { backgroundImage: `url(${image})` } : undefined}
                    role="img"
                    aria-label={card.visual?.alt_text ?? ""}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </AnimatePresence>

            <div
                className={styles.scrim}
                aria-hidden="true"
            />

            <AnimatePresence mode="wait">
                <DraggableCard key={cardId}>
                    <NarrativeCard
                        card={card}
                        onChoose={handleChoose}
                    />
                </DraggableCard>
            </AnimatePresence>
        </div>
    );
}
