import { useState } from 'react';
import ToggleBar from './ToggleBar';
import SectionArea from './SectionArea';
import styles from './SubArea.module.css';

/**
 * SubArea — floats above MainArea as a bottom-anchored overlay (position:
 * absolute, sized to its own content — see SubArea.module.css), so it never
 * resizes or displaces MainArea. Split into:
 *  - SectionArea: fixed-height (--section-area-height) content panel
 *    (stats panel today; inventory/menu panels to come)
 *  - ToggleBar: fixed-height (--sub-toggle-height), always-bottom, 3 icons
 *    (profile/stats, inventory, menu) — see style-board §4.
 */
export default function SubArea() {
  const [activeSection, setActiveSection] = useState('stats');

  return (
    <div className={styles.subArea}>
      <SectionArea section={activeSection} />
      <ToggleBar active={activeSection} onChange={setActiveSection} />
    </div>
  );
}
