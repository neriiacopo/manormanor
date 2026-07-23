import styles from './ProgressBar.module.css';

/**
 * ProgressBar — the thin top strip (style-board §4: "Progress bar" row).
 * Renders as a solid filled block followed by an outlined empty frame —
 * matching the style-board reference art — rather than a single bar with
 * an inner fill. Tracks overall journey/chapter progress — distinct from
 * the stat bars in Stats.
 */
export default function ProgressBar({ value = 0, max = 1, label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={styles.root}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      aria-label={label}
    >
      {pct > 0 && (
        <div className={styles.fill} style={{ flexBasis: `${pct}%` }} />
      )}
      {pct < 100 && (
        <div className={styles.frame} style={{ flexBasis: `${100 - pct}%` }} />
      )}
    </div>
  );
}
