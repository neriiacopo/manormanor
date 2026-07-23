import { ProgressBar } from '../../../components';
import styles from './ProgressArea.module.css';

/**
 * ProgressArea — thin top strip (~1/6 of viewport), houses the journey
 * ProgressBar. Kept as its own layout wrapper (rather than inlining
 * ProgressBar directly in GameView) so there's a single place to add
 * anything else that belongs in this strip later (chapter label, back
 * button, etc).
 */
export default function ProgressArea({ value = 0, max = 1, label }) {
  return (
    <div className={styles.progressArea}>
      <ProgressBar value={value} max={max} label={label} />
    </div>
  );
}
