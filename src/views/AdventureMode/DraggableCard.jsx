import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./DraggableCard.module.css";

// How much of the card is still hidden below the fold when it first
// appears — the user drags the rest of the way up themselves.
const PEEK_RATIO = 0.5;

// Distance the card travels on exit (click a choice) — just needs to clear
// the tallest possible viewport, exact value doesn't matter.
const EXIT_DISTANCE = 1400;

/**
 * DraggableCard — the drag/peek/lock shell around one NarrativeCard.
 *
 *  - Vertical: a bounded, "sticky" scroll. The card spawns half hidden
 *    below the fold (`PEEK_RATIO`) and the player drags it the rest of the
 *    way up; `dragConstraints` hard-stops it at y:0 (fully revealed, choice
 *    button included) — that's the "lock" — and at the peek offset going
 *    the other way, so it can't be dragged fully out of view either.
 *  - Horizontal: no functional meaning, just a bit of physicality. The
 *    constraint window is zero-width (`left: 0, right: 0`), so any sideways
 *    drag is purely elastic and springs back to center on release —
 *    Framer's default behavior for drags released outside their
 *    constraints, no extra code needed.
 *
 * Mount/unmount (swapping to a new card) is driven by the parent via
 * AnimatePresence — `exit` below is what plays when this card is removed.
 */
export default function DraggableCard({ children }) {
    const containerRef = useRef(null);
    const [peek, setPeek] = useState(320); // reasonable guess before we can measure

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return undefined;

        const measure = () => setPeek(el.clientHeight * PEEK_RATIO);
        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={styles.container}
        >
            <motion.div
                className={styles.draggable}
                drag
                dragConstraints={{ top: 0, bottom: peek, left: 0, right: 0 }}
                dragElastic={{ top: 0.08, bottom: 0.08, left: 0.6, right: 0.6 }}
                dragMomentum={false}
                initial={{ y: peek, opacity: 1 }}
                exit={{
                    y: -EXIT_DISTANCE,
                    opacity: 0,
                    transition: { duration: 0.45, ease: "easeIn" },
                }}
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
            >
                {children}
            </motion.div>
        </div>
    );
}
