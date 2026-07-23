import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Die.module.css';

/**
 * Die — flat, ink-illustration-style die glyph, matching the diamond icon
 * seen in the combat mockups (2_combat_1 / 3_combat_2) — NOT a rendered 3D
 * object.
 *
 * Why not R3F: the reference art shows a flat filled/outlined diamond, not
 * a tumbling 3D solid, and correct polyhedral geometry (pip/face layout for
 * d4/d6/d8/d12/d20, plus d100 conventionally being a paired d10) is a lot
 * of extra complexity the art style doesn't ask for. If a later pass wants
 * a "premium" 3D tumble, swap the internals only — keep this exact props
 * contract so nothing upstream (CombatMode, a future VersusPanel) has to
 * change:
 *
 *   <Die sides={20} result={14} rolling={false} />
 *
 * @param {4|6|8|10|12|20|100} sides
 * @param {number} [count=1]        number of dice to show side by side
 * @param {boolean} [rolling=false] true = pending state, cycles random faces
 * @param {number|null} [result]    resolved face value; ignored while rolling
 */
export default function Die({ sides = 4, count = 1, rolling = false, result = null }) {
  const [face, setFace] = useState(result);

  useEffect(() => {
    if (!rolling) {
      setFace(result);
      return undefined;
    }
    const id = setInterval(() => {
      setFace(1 + Math.floor(Math.random() * sides));
    }, 80);
    return () => clearInterval(id);
  }, [rolling, sides, result]);

  return (
    <div className={styles.dieRow}>
      {Array.from({ length: count }).map((_, i) => (
        <AnimatePresence mode="popLayout" key={i}>
          <motion.div
            key={rolling ? `rolling-${face}` : `settled-${result}`}
            className={[styles.die, rolling ? styles.pending : styles.resolved].join(' ')}
            initial={{ rotate: -8, scale: 0.9, opacity: 0.6 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <span className={styles.face}>{face ?? '?'}</span>
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
}
