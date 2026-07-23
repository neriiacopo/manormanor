import styles from './RoughBox.module.css';

/**
 * RoughBox — gives any panel a torn/ruined paper-roll edge instead of a
 * clean rectangle. Used for narrative cards, the combat versus-panel frame,
 * dice tray, etc. (style-board §5b: "ancient paper roll style, borders
 * ruined, moss stained").
 *
 * Edge irregularity is driven by an SVG clip-path so it stays crisp at any
 * size.
 *
 * TODO(cowork): art-direct this clip-path against the actual mockup card
 * borders — current path is a placeholder jagged rectangle, not hand-drawn.
 */
const ROUGH_EDGE_PATH =
  'polygon(1% 4%, 6% 0%, 94% 2%, 99% 6%, 98% 40%, 100% 60%, 97% 96%, 90% 100%, 8% 99%, 2% 94%, 3% 55%, 0% 45%)';

export default function RoughBox({ children, className, style, ...rest }) {
  return (
    <div
      className={[styles.roughBox, className].filter(Boolean).join(' ')}
      style={{ clipPath: ROUGH_EDGE_PATH, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
