import { SquiggleFx } from '../../fx';
import styles from './ScribbleBox.module.css';

/**
 * ScribbleBox — the base "player-facing action" container: hand-drawn
 * border, Rock Salt label, optional SquiggleFx jitter. This is the visual
 * home of every button-like control: landing menu items, combat tactic/
 * action buttons, NEXT ROUND, etc.
 *
 * @param {boolean} squiggle — wraps the label in SquiggleFx (see combat
 *   buttons in the reference mockups, which read as more "alive" than the
 *   landing menu items).
 */
export default function ScribbleBox({
  children,
  onClick,
  active = false,
  disabled = false,
  squiggle = false,
  className,
  ...rest
}) {
  const label = <span className={styles.label}>{children}</span>;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[styles.scribbleBox, active && styles.active, disabled && styles.disabled, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {squiggle ? <SquiggleFx as="span">{label}</SquiggleFx> : label}
    </button>
  );
}
