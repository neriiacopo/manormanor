import styles from './StainedBox.module.css';

/**
 * StainedBox — parchment container with moss/age staining. Used as the base
 * wrapper for adventure-mode cards, the landing background, and any surface
 * that should read as aged paper rather than a flat panel.
 *
 * @param {'light'|'mid'|'dark'} tone — maps to the parchment-* tokens
 *
 * TODO(cowork): swap the procedural CSS stain (radial-gradient blotches) for
 * the actual illustrated stain assets from the Illustrator mockups once
 * they're exported as standalone textures.
 */
export default function StainedBox({ children, tone = 'mid', className, ...rest }) {
  return (
    <div
      className={[styles.stainedBox, styles[`tone-${tone}`], className].filter(Boolean).join(' ')}
      {...rest}
    >
      <div className={styles.stainLayer} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
