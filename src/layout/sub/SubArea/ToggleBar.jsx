import { Icon } from '../../../components';
import styles from './ToggleBar.module.css';

const TOGGLES = [
  { key: 'stats', label: 'Profile', icon: 'profile-01' },
  { key: 'inventory', label: 'Inventory', icon: 'inventory-01' },
  { key: 'menu', label: 'Menu', icon: 'menu-01' },
];

/**
 * ToggleBar — fixed-height bottom row, 3 icons, switches which panel
 * SectionArea shows. Always visible regardless of mode (Adventure/Combat).
 * The active toggle sits raised above the others (style-board reference).
 */
export default function ToggleBar({ active, onChange }) {
  return (
    <nav className={styles.toggleBar}>
      {TOGGLES.map(({ key, label, icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            className={[styles.toggle, isActive && styles.active].filter(Boolean).join(' ')}
            onClick={() => onChange(key)}
            aria-label={label}
            aria-pressed={isActive}
          >
            <Icon
              name={icon}
              size={32}
              fillColor="var(--color-ink)"
            />
          </button>
        );
      })}
    </nav>
  );
}
