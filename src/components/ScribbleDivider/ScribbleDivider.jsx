import styles from './ScribbleDivider.module.css';

/**
 * ScribbleDivider — hand-drawn hairline used between menu items and
 * between the TACTICS / ACTIONS / RESULTS phases. Supports a `struck`
 * state for the phase-switcher's strike-through-on-complete behavior
 * (see style-board §5c and §6 "Phase strike-through").
 */
export default function ScribbleDivider({ struck = false, orientation = 'horizontal', className }) {
  return (
    <div
      className={[styles.divider, styles[orientation], struck && styles.struck, className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  );
}
